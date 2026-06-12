'use client';
import { Bell, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AlertsList({ chats, onChatSelect }) {
  const unreadChats = chats.filter(chat => 
    chat.lastMessage && 
    !chat.lastMessage.isSeen && 
    chat.lastMessage.senderId !== (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '')
  );

  return (
    <div className="w-80 lg:w-[360px] border-r border-white/5 bg-[#09090b] flex flex-col h-full overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-nova-square font-semibold tracking-tight">Alerts</h2>
          {unreadChats.length > 0 && (
            <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-white/10">
              {unreadChats.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {unreadChats.length > 0 ? (
          unreadChats.map((chat) => (
            <button
              key={chat.id || chat._id}
              onClick={() => onChatSelect(chat)}
              className="w-full flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-left relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
                    {chat.otherUser.image ? (
                      <img src={chat.otherUser.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 font-nova-square">
                        {chat.otherUser.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white font-montserrat">{chat.otherUser.name}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium font-montserrat">
                    {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/5 rounded-lg text-white/40 mt-1">
                  <MessageSquare className="w-3 h-3" />
                </div>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-montserrat">
                  {chat.lastMessage.content}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
            <div className="p-6 bg-white/5 rounded-full border border-white/10">
              <Bell className="w-10 h-10 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-nova-square uppercase tracking-widest">Quiet for now</p>
              <p className="text-[10px] text-gray-500 mt-1 font-montserrat">No new notifications or alerts.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
