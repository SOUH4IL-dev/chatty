'use client';
import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function ContactsList({ onChatSelect }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/chat/contacts');
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 lg:w-[360px] border-r border-white/5 bg-[#09090b] flex flex-col h-full overflow-hidden">
      <div className="p-8">
        <h2 className="text-xl font-nova-square font-semibold tracking-tight mb-6">Contacts</h2>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a contact..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all text-xs font-montserrat"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {loading ? (
          <div className="flex justify-center py-10 opacity-20">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((user) => (
            <button
              key={user._id}
              onClick={() => onChatSelect({ otherUser: user })}
              className="w-full flex items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-all group border border-transparent hover:border-white/5"
            >
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full overflow-hidden border border-white/5 ${!user.image ? 'bg-gradient-to-br from-gray-700 to-gray-800' : ''}`}>
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400 font-nova-square">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                {user.status === 'online' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-[3px] border-[#09090b] rounded-full shadow-lg" />
                )}
              </div>

              <div className="ml-4 text-left flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-200 truncate font-montserrat">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5 font-montserrat opacity-60">{user.email}</p>
              </div>

              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-600 font-montserrat">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
