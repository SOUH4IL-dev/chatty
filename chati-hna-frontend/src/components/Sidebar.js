'use client';
import { MessageSquare, Users, Settings, LogOut, Bell, Camera, User as UserIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const router = useRouter();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setIsUploading(true);
      try {
        const { data } = await api.put('/auth/update-profile', { image: base64String });
        const updatedUser = data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        // Refresh page to sync across components (simplest way)
        window.location.reload();
      } catch (err) {
        console.error('Failed to update avatar');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const navItems = [
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 lg:w-64
          border-r border-white/5 bg-[#09090b]
          flex flex-col items-start p-4
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Mobile close button + logo row */}
        <div className="mb-10 px-4 py-2 flex items-center justify-between w-full">
          <Image src="/logo.svg" alt="Logo" width={300} height={300} className="rounded-full h-auto w-32" quality={100} />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 w-full space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-white/5 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : ''}`} />
              <span className="ml-3 font-medium text-sm">{item.label}</span>
              {item.id === 'notifications' && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/20" />
              )}
            </button>
          ))}
        </nav>

        <div className="w-full pt-4 border-t border-white/5 mt-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          <div className="px-4 mb-4 flex items-center space-x-3">
            <button
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="relative group/avatar w-10 h-10 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all flex-shrink-0"
            >
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover group-hover/avatar:opacity-40 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover/avatar:opacity-40 transition-opacity">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                {isUploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
              </div>
            </button>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase tracking-wider mt-0.5">Online</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="ml-3 font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
