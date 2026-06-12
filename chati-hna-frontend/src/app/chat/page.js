'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import api from '@/lib/api';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ContactsList from '@/components/ContactsList';
import AlertsList from '@/components/AlertsList';
import ChatWindow from '@/components/ChatWindow';
import SettingsView from '@/components/SettingsView';
import CallModal from '@/components/CallModal';

const NOTIFICATION_SOUND = 'https://actions.google.com/sounds/v1/communication/pop_up_alert.ogg';
const CALL_SOUND = 'https://actions.google.com/sounds/v1/communication/incoming_call_dial.ogg';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Call States
  const [call, setCall] = useState(null);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef();
  const activeChatRef = useRef(activeChat);
  const ringtoneRef = useRef(null);

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    let isSubscribed = true;
    let unsubAuth;

    const init = async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user profile from backend (creates if new, returns Mongo user)
        const { data } = await api.get('/auth/me');
        if (!isSubscribed) return;

        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Connect socket with fresh Firebase token
        const token = await firebaseUser.getIdToken();
        disconnectSocket();
        connectSocket(token);

        fetchChats();
      } catch (err) {
        console.error('Init failed:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      }
    };

    unsubAuth = onAuthStateChanged(auth, init);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Socket listeners — update local state instead of full refetch
    socket.on('receive_message', (message) => {
      const audio = new Audio(NOTIFICATION_SOUND);
      if (activeChatRef.current && message.chatId === activeChatRef.current.id) {
        setMessages((prev) => [...prev, message]);
        api.post(`/chat/mark-seen/${message.chatId}`);
        if (document.visibilityState !== "visible") {
          audio.play().catch(() => {});
        }
      } else {
        audio.play().catch(() => {});
        if (Notification.permission === "granted" && document.visibilityState !== "visible") {
          new Notification(message.sender?.name || 'New message', {
            body: message.type === 'audio' ? 'Voice message' : (message.content || ''),
            icon: "/favicon.ico"
          });
        }
      }
      // Move chat to top with new last message in-place
      setChats((prev) => {
        const idx = prev.findIndex(c => c.id === message.chatId);
        if (idx === -1) return prev;
        const chat = { ...prev[idx], lastMessage: message, updatedAt: new Date() };
        const updated = [...prev];
        updated.splice(idx, 1);
        updated.unshift(chat);
        return updated;
      });
    });

    socket.on('messages_seen', ({ chatId }) => {
      const currentChatId = activeChatRef.current?.id || activeChatRef.current?._id;
      if (currentChatId && chatId === currentChatId.toString()) {
        setMessages((prev) => prev.map(msg => ({ ...msg, isSeen: true })));
      }
    });

    socket.on('user_status', ({ userId, status, lastSeen }) => {
      setChats((prev) => prev.map(chat => {
        if (chat.otherUser?.id === userId) {
          return { ...chat, otherUser: { ...chat.otherUser, status, lastSeen } };
        }
        return chat;
      }));

      if (activeChatRef.current && activeChatRef.current.otherUser?.id === userId) {
        setActiveChat((prev) => prev ? {
          ...prev,
          otherUser: { ...prev.otherUser, status, lastSeen }
        } : prev);
      }
    });

    socket.on('message_updated', ({ messageId, content, chatId }) => {
      const currentChatId = activeChatRef.current?.id || activeChatRef.current?._id;
      if (currentChatId && chatId === currentChatId.toString()) {
        setMessages((prev) => prev.map(msg => msg.id === messageId ? { ...msg, content } : msg));
      }
    });

    socket.on('message_deleted', ({ messageId, chatId }) => {
      const currentChatId = activeChatRef.current?.id || activeChatRef.current?._id;
      if (currentChatId && chatId === currentChatId.toString()) {
        setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      }
    });

    socket.on('chat_deleted', ({ chatId }) => {
      const currentChatId = activeChatRef.current?.id || activeChatRef.current?._id;
      if (currentChatId && chatId === currentChatId.toString()) {
        setActiveChat(null);
        setMessages([]);
      }
      setChats((prev) => prev.filter(c => c.id !== chatId));
    });

    socket.on('incoming-call', async ({ from, fromName, offer, type }) => {
      setCall({ from, fromName, offer, type });
      setIsReceivingCall(true);
      ringtoneRef.current = new Audio(CALL_SOUND);
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(() => {});
    });

    socket.on('call-answered', async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('call-ended', () => {
      endCall();
    });

    return () => {
      if (unsubAuth) unsubAuth();
      disconnectSocket();
      socket.off('receive_message');
      socket.off('messages_seen');
      socket.off('user_status');
      socket.off('message_updated');
      socket.off('message_deleted');
      socket.off('chat_deleted');
      socket.off('incoming-call');
      socket.off('call-answered');
      socket.off('ice-candidate');
      socket.off('call-ended');
    };
  }, [router]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chat/list');
      setChats(data);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    }
  };

  const initPeerConnection = async (stream) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { 
          to: call?.from || activeChat?.otherUser?.id || activeChat?.otherUser?._id, 
          candidate: event.candidate 
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
  };

  const startCall = async (type = 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: type === 'video', 
        audio: true 
      });
      setLocalStream(stream);
      setCall({ toName: activeChat.otherUser.name, type });

      await initPeerConnection(stream);
      
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      socket.emit('call-user', {
        to: activeChat.otherUser.id || activeChat.otherUser._id,
        fromName: currentUser.name,
        offer,
        type
      });
    } catch (err) {
      console.error('Failed to start call', err);
    }
  };

  const answerCall = async () => {
    try {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: call.type === 'video', 
        audio: true 
      });
      setLocalStream(stream);
      setIsReceivingCall(false);

      await initPeerConnection(stream);
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(call.offer));
      
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      socket.emit('answer-call', { to: call.from, answer });
    } catch (err) {
      console.error('Failed to answer call', err);
    }
  };

  const endCall = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    const toId = call?.from || activeChat?.otherUser?.id || activeChat?.otherUser?._id;
    if (toId) socket.emit('end-call', { to: toId });

    setCall(null);
    setIsReceivingCall(false);
    setLocalStream(null);
    setRemoteStream(null);
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    setSidebarOpen(false); // close sidebar when opening a chat on mobile
    if (!chat.id) {
      setMessages([]);
      return;
    }
    try {
      const actualChatId = chat.id || chat._id;
      const { data } = await api.get(`/chat/messages/${actualChatId}`);
      setMessages(data);
      // Mark as seen
      await api.post(`/chat/mark-seen/${actualChatId}`);
      fetchChats();
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (content, audio = null) => {
    if (!activeChat) return;
    try {
      const receiverId = activeChat.otherUser.id || activeChat.otherUser._id;
      const { data } = await api.post('/chat/send', {
        receiverId,
        content,
        audio
      });
      setMessages((prev) => [...prev, data]);
      // Update activeChat with ID if it was a new chat
      if (!activeChat.id && !activeChat._id) {
        setActiveChat(prev => ({ ...prev, id: data.chatId }));
      }
      fetchChats();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleUpdateMessage = async (messageId, content) => {
    try {
      await api.put(`/chat/message/${messageId}`, { content });
      setMessages((prev) => prev.map(msg => msg.id === messageId ? { ...msg, content } : msg));
      fetchChats();
    } catch (err) { console.error('Failed to update message:', err); }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/chat/message/${messageId}`);
      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      fetchChats();
    } catch (err) { console.error('Failed to delete message:', err); }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await api.delete(`/chat/${chatId}`);
      setActiveChat(null);
      setMessages([]);
      fetchChats();
    } catch (err) { console.error('Failed to delete chat:', err); }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="absolute top-0 left-0 right-0 h-14 flex items-center px-4 z-30 bg-[#09090b] border-b border-white/5 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Open menu"
          >
            {/* Hamburger icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-semibold text-white tracking-tight">Chatihna</span>
        </div>
        {/* Panel content — offset by mobile top bar height */}
        <div className="flex flex-1 overflow-hidden pt-14 lg:pt-0 min-w-0">
          {activeTab === 'settings' ? (
            <div className="flex-1 overflow-y-auto min-w-0">
              <SettingsView currentUser={currentUser} onUpdateUser={handleUpdateUser} />
            </div>
          ) : (
            <>
              {/* Chat/Contacts/Alerts list — hidden on mobile when a chat is open */}
              <div className={`${
                activeChat ? 'hidden lg:flex' : 'flex'
              } flex-col w-full lg:w-80 xl:w-[360px] flex-shrink-0`}>
                {activeTab === 'chats' && (
                  <ChatList
                    chats={chats}
                    activeChat={activeChat}
                    onChatSelect={handleChatSelect}
                  />
                )}
                {activeTab === 'contacts' && (
                  <ContactsList
                    onChatSelect={(chat) => {
                      setActiveTab('chats');
                      handleChatSelect(chat);
                    }}
                  />
                )}
                {activeTab === 'notifications' && (
                  <AlertsList
                    chats={chats}
                    onChatSelect={(chat) => {
                      setActiveTab('chats');
                      handleChatSelect(chat);
                    }}
                  />
                )}
              </div>

              {/* ChatWindow — full screen on mobile, flex-1 on desktop */}
              <div className={`${
                activeChat ? 'flex' : 'hidden lg:flex'
              } flex-col flex-1 min-w-0`}>
                <ChatWindow
                  chat={activeChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUser={currentUser}
                  onStartCall={startCall}
                  onDeleteChat={handleDeleteChat}
                  onUpdateMessage={handleUpdateMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onBack={() => setActiveChat(null)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {(call || isReceivingCall) && (
        <CallModal 
          callData={call}
          isReceiving={isReceivingCall}
          onAnswer={answerCall}
          onReject={endCall}
          onEnd={endCall}
          localStream={localStream}
          remoteStream={remoteStream}
        />
      )}
    </div>
  );
}
