'use client';
import { useState, useEffect } from 'react';
import { Search, X, Circle } from 'lucide-react';
import api from '@/lib/api';

export default function ChatList({ chats, activeChat, onChatSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const { data } = await api.get(`/chat/search?query=${searchQuery}`);
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const displayList = searchQuery ? searchResults : chats;

  return (
    <div className="w-80 lg:w-[360px] border-r border-white/5 bg-[#09090b] flex flex-col">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Messages</h2>
          <span className="bg-white/5 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded text-gray-500 font-bold">
            {chats.length} Total
          </span>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users or messages..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 pl-10 pr-10 outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {searchQuery ? (
          <>
            {/* Users Section */}
            {searchResults.users?.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-4">People</p>
                <div className="space-y-1">
                  {searchResults.users.map((user) => (
                    <button
                      key={user.id || user._id}
                      onClick={() => onChatSelect({ otherUser: user })}
                      className="w-full flex items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 border border-white/5`}>
                        {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{user.name[0]}</div>}
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-200">{user.name}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Section */}
            {searchResults.messages?.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-4">Messages</p>
                <div className="space-y-1">
                  {searchResults.messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => onChatSelect({ id: msg.chatId, otherUser: msg.otherUser })}
                      className="w-full flex flex-col p-4 rounded-2xl hover:bg-white/[0.02] transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-300">{msg.otherUser?.name}</span>
                        <span className="text-[9px] text-gray-600">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 italic">"{msg.content}"</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.users?.length === 0 && searchResults.messages?.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
              </div>
            )}
          </>
        ) : (
          /* Regular Chat List */
          chats.map((item) => {
            const user = item.otherUser;
            const isActive = activeChat?.otherUser?.id === (item.id || item._id) || activeChat?.id === item.id;
            
            return (
              <button
                key={item.id || item._id}
                onClick={() => onChatSelect(item)}
                className={`w-full flex items-center p-4 rounded-2xl transition-all duration-200 group relative ${
                  isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                )}
                
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border border-white/5 ${!user.image ? 'bg-gradient-to-br from-gray-700 to-gray-800' : ''}`}>
                    {user.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400">
                        {user.name[0]}
                      </div>
                    )}
                  </div>
                  {user.status === 'online' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-[3px] border-[#09090b] rounded-full shadow-lg" />
                  )}
                </div>
  
                <div className="ml-4 text-left flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{user.name}</span>
                      {item.lastMessage && !item.lastMessage.isSeen && item.lastMessage.senderId !== (activeChat?.currentUser?.id || localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '') && (
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 shadow-lg shadow-white/20" />
                      )}
                    </div>
                    {item.lastMessage && (
                      <span className="text-[10px] text-gray-500 font-medium">
                        {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate leading-relaxed">
                    {item.lastMessage?.content || 'Started a conversation'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
