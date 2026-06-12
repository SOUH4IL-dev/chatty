'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, Phone, Video, MoreVertical, Plus, Mic, Check, CheckCheck, Trash2, Edit2, X, AlertCircle, Square } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow({ chat, messages, onSendMessage, currentUser, onStartCall, onDeleteChat, onUpdateMessage, onDeleteMessage, onBack }) {
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const scrollRef = useRef();
  const emojiPickerRef = useRef();

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendMessage(content);
    setContent('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          onSendMessage('Voice message', base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setRecordingTime(0);
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    onUpdateMessage(editingMessage.id, editContent);
    setEditingMessage(null);
    setEditContent('');
  };

  const confirmDelete = () => {
    onDeleteMessage(deletingMessageId);
    setDeletingMessageId(null);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#09090b]">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Send className="w-6 h-6 text-gray-700" />
        </div>
        <h2 className="text-xl font-medium text-gray-300">Your messages</h2>
        <p className="text-sm text-gray-600 mt-2">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#09090b] relative">
      {/* Header */}
      <header className="h-14 lg:h-20 px-4 lg:px-8 flex items-center justify-between border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center group cursor-pointer">
          {/* Back button — mobile only */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden mr-3 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-all">
              {chat.otherUser.image ? (
                <img src={chat.otherUser.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-xs">
                  {chat.otherUser.name[0]}
                </div>
              )}
            </div>
            {chat.otherUser.status === 'online' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#09090b] rounded-full" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-white tracking-tight">{chat.otherUser.name}</h3>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${chat.otherUser.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
              {chat.otherUser.status === 'online' ? 'Active now' : chat.otherUser.lastSeen ? `Last seen ${formatDistanceToNow(new Date(chat.otherUser.lastSeen), { addSuffix: true })}` : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => onStartCall('audio')} className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Phone className="w-4 h-4" />
          </button>
          <button onClick={() => onStartCall('video')} className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Video className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button 
            onClick={() => { if(confirm('Delete this entire chat?')) onDeleteChat(chat.id) }} 
            className="p-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg, i) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] relative`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all relative ${
                    isMe 
                      ? 'bg-white text-black rounded-br-none shadow-white/5 hover:bg-gray-100' 
                      : 'bg-white/[0.03] border border-white/5 text-gray-200 rounded-bl-none hover:bg-white/[0.05]'
                  }`}>
                    {msg.isEdited && (
                      <span className="absolute -top-4 right-0 text-[9px] text-gray-500 font-medium">edited</span>
                    )}
                    {msg.type === 'audio' && msg.audioUrl ? (
                      <audio controls src={msg.audioUrl} className="max-w-[200px] sm:max-w-[250px] h-10" />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  
                  {isMe && (
                    <div className="absolute top-1/2 -translate-y-1/2 -left-10 opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <div className="bg-[#18181b] border border-white/10 rounded-xl flex shadow-2xl overflow-hidden scale-90 group-hover:scale-100 transition-transform">
                        <button 
                          onClick={() => { setEditingMessage(msg); setEditContent(msg.content); }}
                          className="p-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors border-r border-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeletingMessageId(msg.id)}
                          className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mt-2 space-x-1">
                    <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <span className="ml-1">
                        {msg.isSeen ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3 text-gray-600" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="p-8 sticky bottom-0 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {editingMessage ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-xl text-white">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Editing Message</p>
                    <p className="text-sm text-gray-400 truncate max-w-md">{editingMessage.content}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingMessage(null)}
                  className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <form 
            onSubmit={editingMessage ? handleUpdate : handleSend} 
            className="glass rounded-2xl p-2 flex items-end space-x-2 shadow-2xl border border-white/10 focus-within:border-white/20 transition-all group/input"
          >
            <button type="button" className="p-3 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </button>
            
            {isRecording ? (
              <div className="flex-1 flex items-center px-4 py-3 text-red-500 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3" />
                <span className="text-sm font-medium">
                  Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              <textarea 
                value={editingMessage ? editContent : content}
                onChange={(e) => editingMessage ? setEditContent(e.target.value) : setContent(e.target.value)}
                placeholder={editingMessage ? "Edit your message..." : `Message ${chat.otherUser.name}...`}
                className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-white placeholder-gray-600 resize-none max-h-32 min-h-[44px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    editingMessage ? handleUpdate(e) : handleSend(e);
                  }
                  if (e.key === 'Escape' && editingMessage) {
                    setEditingMessage(null);
                  }
                }}
              />
            )}

            <div className="flex items-center p-1 space-x-1 relative" ref={emojiPickerRef}>
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2.5 rounded-lg transition-all ${showEmojiPicker ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Smile className="w-4 h-4" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-4 z-50">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => {
                      if (editingMessage) setEditContent(prev => prev + emojiData.emoji);
                      else setContent(prev => prev + emojiData.emoji);
                    }}
                    theme="dark"
                    lazyLoadEmojis={true}
                  />
                </div>
              )}
              
              {isRecording ? (
                <button 
                  type="button"
                  onClick={stopRecording}
                  className="p-2.5 rounded-xl transition-all bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (editingMessage ? editContent.trim() : content.trim()) ? (
                <button 
                  type="submit"
                  className="p-2.5 rounded-xl transition-all bg-white text-black shadow-lg shadow-white/10 hover:bg-gray-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={startRecording}
                  className="p-2.5 rounded-xl transition-all bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                  title="Hold or click to record"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-4 flex justify-center items-center space-x-4">
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
              {editingMessage ? 'ESC to cancel • ENTER to save' : 'SHIFT + ENTER for new line'}
            </p>
            {!editingMessage && (
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-800 rounded-full" />
                <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">End-to-end encrypted</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingMessageId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMessageId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-[340px] glass border border-white/10 rounded-[32px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Remove Message?</h3>
                <p className="text-gray-400 text-xs mb-10 leading-relaxed font-medium opacity-60">
                  This message will be permanently deleted for all participants.
                </p>
                <div className="flex flex-col w-full space-y-3">
                  <button 
                    onClick={confirmDelete}
                    className="w-full py-3.5 rounded-2xl bg-white text-black text-xs font-bold transition-all hover:bg-gray-200"
                  >
                    Delete for everyone
                  </button>
                  <button 
                    onClick={() => setDeletingMessageId(null)}
                    className="w-full py-3.5 rounded-2xl bg-transparent text-gray-500 text-xs font-bold transition-all hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
