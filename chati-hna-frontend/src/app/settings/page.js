'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '@/lib/api';
import SettingsFirebase from '@/components/SettingsFirebase';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        router.push('/login');
        return;
      }

      setFirebaseUser(fbUser);

      const cached = localStorage.getItem('user');
      if (cached) {
        try { setCurrentUser(JSON.parse(cached)); } catch {}
      }

      api.get('/auth/me').then(({ data }) => {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }).catch(() => {
        const fbFallback = {
          id: fbUser.uid,
          name: fbUser.displayName || '',
          email: fbUser.email || '',
          image: fbUser.photoURL || '',
        };
        setCurrentUser(fbFallback);
        localStorage.setItem('user', JSON.stringify(fbFallback));
      });
    });
    return () => unsub();
  }, [router]);

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (!firebaseUser) {
    return (
      <div className="flex h-screen bg-[#09090b] text-white overflow-hidden items-center justify-center">
        <p className="text-zinc-400">Redirecting to login...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <SettingsFirebase
        firebaseUser={firebaseUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
