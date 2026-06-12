'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Camera, Loader2, User, CheckCircle, AlertCircle,
  Mail, Lock, Eye, EyeOff, LogIn
} from 'lucide-react';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import api from '@/lib/api';

export default function SettingsView({ currentUser, onUpdateUser, firebaseUser }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Re-auth state
  const [showReauth, setShowReauth] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const fileInputRef = useRef();

  const isGoogleUser = firebaseUser?.providerData?.some(p => p.providerId === 'google.com');

  useEffect(() => {
    setName(currentUser?.name || '');
  }, [currentUser]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setIsUploading(true);
      setError('');
      setSuccess('');
      try {
        const { data } = await api.put('/auth/me', {
          name,
          image: base64String
        });
        onUpdateUser(data.user);
        setSuccess('Profile picture updated successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.put('/auth/me', {
        name,
        image: currentUser?.image || ''
      });
      onUpdateUser(data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    setError('');
    setSuccess('');

    if (!newEmail.trim()) {
      setError('New email is required');
      return;
    }
    if (newEmail === firebaseUser?.email) {
      setError('New email is the same as current email');
      return;
    }

    setEmailLoading(true);
    try {
      await updateEmail(firebaseUser, newEmail);
      const { data } = await api.put('/auth/me', { name: currentUser.name, email: newEmail, image: currentUser.image || '' });
      onUpdateUser(data.user);
      setSuccess('Email updated successfully!');
      setNewEmail('');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setPendingAction('email');
        setShowReauth(true);
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use by another account.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Failed to update email.');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setPendingAction('password');
        setShowReauth(true);
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else if (err.code === 'auth/weak-password') {
        setError('New password must be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to update password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleReauthAndRetry = async () => {
    setReauthLoading(true);
    setError('');
    try {
      if (isGoogleUser) {
        await reauthenticateWithPopup(firebaseUser, googleProvider);
      } else {
        if (!reauthPassword) {
          setError('Password is required to re-authenticate');
          setReauthLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(firebaseUser.email, reauthPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
      }

      setShowReauth(false);
      setReauthPassword('');

      if (pendingAction === 'email') {
        await updateEmail(firebaseUser, newEmail);
        const { data } = await api.put('/auth/me', { name: currentUser.name, email: newEmail, image: currentUser.image || '' });
        onUpdateUser(data.user);
        setSuccess('Email updated successfully!');
        setNewEmail('');
      } else if (pendingAction === 'password') {
        await updatePassword(firebaseUser, newPassword);
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      setPendingAction(null);
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Re-authentication failed. Incorrect password.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled.');
      } else {
        setError(err.message || 'Re-authentication failed. Please try again.');
      }
    } finally {
      setReauthLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] px-6 py-10 md:px-10 lg:px-16 flex flex-col items-center custom-scrollbar">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-montserrat">
            Account Settings
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-2 font-medium">
            Manage your profile, email, and security.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/10 text-red-400 text-xs sm:text-sm flex items-start space-x-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 text-emerald-400 text-xs sm:text-sm flex items-start space-x-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* --- Profile Photo --- */}
          <div className="glass p-6 rounded-[24px] border border-white/5 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-lg hover:border-white/10 transition-colors duration-300">
            <div className="relative group/avatar">
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                type="button"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center relative cursor-pointer"
              >
                {currentUser?.image ? (
                  <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover group-hover/avatar:opacity-30 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 group-hover/avatar:opacity-30 transition-opacity">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/40">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="text-white font-bold text-base md:text-lg">Profile Photo</h3>
              <p className="text-zinc-500 text-xs mt-1 font-medium leading-relaxed">
                Upload a high-quality square image. Max size 5MB.
              </p>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all border border-white/5 flex items-center space-x-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Change Photo</span>
                )}
              </button>
            </div>
          </div>

          {/* --- Personal Information --- */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass p-6 rounded-[24px] border border-white/5 space-y-4 shadow-lg hover:border-white/10 transition-colors duration-300">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-3">
                Personal Information
              </h2>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: '0 4px 15px rgba(var(--accent-primary-rgb), 0.3)'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </form>

          {/* --- Email Section --- */}
          <div className="glass p-6 rounded-[24px] border border-white/5 space-y-4 shadow-lg hover:border-white/10 transition-colors duration-300">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Email Address
            </h2>

            <div className="text-sm text-zinc-400">
              Current: <span className="text-zinc-300 font-medium">{firebaseUser?.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                placeholder="Enter new email address"
              />
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={emailLoading}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {emailLoading ? 'Updating...' : 'Change Email'}
              </button>
            </div>
          </div>

          {/* --- Password Section --- */}
          {!isGoogleUser && (
            <div className="glass p-6 rounded-[24px] border border-white/5 space-y-4 shadow-lg hover:border-white/10 transition-colors duration-300">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Password
              </h2>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                  placeholder="Enter current password"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 pl-4 pr-12 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 shadow-lg"
                >
                  {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Re-authentication Modal --- */}
      {showReauth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Re-authentication Required</h3>
            <p className="text-zinc-400 text-sm mb-6">
              For security reasons, please sign in again to continue.
            </p>

            {isGoogleUser ? (
              <button
                type="button"
                onClick={handleReauthAndRetry}
                disabled={reauthLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {reauthLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {reauthLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input
                    type="password"
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
                    placeholder="Enter your password"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReauth(false);
                      setPendingAction(null);
                      setReauthPassword('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReauthAndRetry}
                    disabled={reauthLoading}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {reauthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {reauthLoading ? 'Verifying...' : 'Confirm'}
                  </button>
                </div>
              </>
            )}

            {reauthLoading && (
              <p className="text-center text-zinc-500 text-xs mt-4">Please wait...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
