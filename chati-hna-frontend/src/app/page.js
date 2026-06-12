'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  MessageSquare, 
  Mic, 
  Settings, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  Lock, 
  Activity,
  Users,
  Check,
  Send,
  Play,
  Heart
} from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, features, tech

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[130px] rounded-full"></div>
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation Bar */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-nova-square text-xl font-bold tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              chatihna
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm text-xs text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Server Online</span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link 
                href="/chat" 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Go to Chat
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-semibold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Messaging Redefined</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6"
            >
              Chatihna. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Chat here, anywhere.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed font-light"
            >
              A premium, minimalist messaging application tailored for fluid communication. Connect instantly, record crystal-clear audio messages, and customize your experience with responsive dark theme aesthetics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link 
                href={isLoggedIn ? "/chat" : "/register"}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
              >
                {isLoggedIn ? "Go to Workspace" : "Start Chatting Free"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a 
                href="#features"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Right Column: Interactive Mock Chat Showcase */}
          <div className="lg:col-span-7 flex justify-center relative w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-2xl rounded-3xl opacity-50"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl bg-zinc-950/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass aspect-[4/3] flex flex-col relative z-10"
            >
              {/* Mock Chat Header */}
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/40">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                      A
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Amine</h3>
                    <p className="text-xs text-emerald-400/80 font-medium">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs text-zinc-500 font-mono">Live Demo</span>
                </div>
              </div>

              {/* Mock Chat Body */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-zinc-950/40">
                {/* Bubble Left */}
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400">
                    A
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3.5">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Fayn a sat? Saliti dak l'app dyal chatihna? 🚀
                    </p>
                    <span className="text-[10px] text-zinc-500 block mt-1">17:21</span>
                  </div>
                </div>

                {/* Bubble Right */}
                <div className="flex items-start gap-2.5 max-w-[80%] ml-auto justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3.5 shadow-lg shadow-blue-600/10">
                    <p className="text-sm leading-relaxed">
                      Ah a khay, ha l-version l-jdida wajda. Chofha! 😎
                    </p>
                    <span className="text-[10px] text-blue-200/70 block mt-1 text-right">17:22</span>
                  </div>
                </div>

                {/* Bubble Left */}
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400">
                    A
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3.5">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Wa 3raaaad a sahbi! Let's test the audio messaging feature. Send me a voice note.
                    </p>
                    <span className="text-[10px] text-zinc-500 block mt-1">17:23</span>
                  </div>
                </div>

                {/* Bubble Right (Voice Note Mock) */}
                <div className="flex items-start gap-2.5 max-w-[80%] ml-auto justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-none p-4 shadow-lg shadow-blue-600/10 w-64">
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md">
                        <Play className="w-3.5 h-3.5 fill-blue-600 ml-0.5" />
                      </button>
                      <div className="flex-1">
                        {/* Fake Waveform */}
                        <div className="flex items-end gap-0.5 h-6">
                          <div className="w-1 bg-white/40 h-2 rounded-full"></div>
                          <div className="w-1 bg-white/40 h-3 rounded-full"></div>
                          <div className="w-1 bg-white/70 h-4 rounded-full"></div>
                          <div className="w-1 bg-white h-5 rounded-full"></div>
                          <div className="w-1 bg-white/70 h-3 rounded-full"></div>
                          <div className="w-1 bg-white h-4 rounded-full"></div>
                          <div className="w-1 bg-white/90 h-6 rounded-full"></div>
                          <div className="w-1 bg-white h-4 rounded-full"></div>
                          <div className="w-1 bg-white/80 h-3 rounded-full"></div>
                          <div className="w-1 bg-white/50 h-5 rounded-full"></div>
                          <div className="w-1 bg-white/30 h-2 rounded-full"></div>
                          <div className="w-1 bg-white/30 h-3 rounded-full"></div>
                          <div className="w-1 bg-white/40 h-2 rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-blue-100">Voice Note</span>
                          <span className="text-[10px] text-blue-100">0:14</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Chat Footer */}
              <div className="h-16 border-t border-white/5 bg-zinc-900/20 px-4 flex items-center gap-3">
                <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <Mic className="w-4 h-4 text-purple-400" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-zinc-300 pointer-events-none"
                  />
                </div>
                <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Core Features Grid */}
      <section id="features" className="border-t border-white/5 bg-zinc-950/20 py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Everything you need in a modern chat application
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Designed with user experience first. Built on modern web technologies to ensure your messaging stays fast, synchronized, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-2xl relative hover:border-blue-500/20 hover:bg-zinc-900/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Real-Time Sync</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Powered by Socket.io, messages and typing status are synced globally in milliseconds. No delays, just live connections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-2xl relative hover:border-purple-500/20 hover:bg-zinc-900/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Audio Messages</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Record and exchange high-quality audio notes directly from your device. Smooth player visualization and control.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-2xl relative hover:border-pink-500/20 hover:bg-zinc-900/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Profile Customization</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Seamless settings system allowing you to update your profile name, change avatars, and secure your account credentials.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-2xl relative hover:border-emerald-500/20 hover:bg-zinc-900/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Secure & Private</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Secure user authentication powered by Firebase. Cross-platform, verified identity with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="border-t border-white/5 py-16 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="font-semibold text-white text-lg">Built with modern developer experience</h4>
            <p className="text-sm text-zinc-400 mt-1">Harnessing cutting-edge tools for maximum efficiency.</p>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-300">Next.js 16 (App Router)</span>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-300">React 19</span>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-300">TailwindCSS v4</span>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-300">Socket.io</span>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-300">Node.js / Express</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="font-nova-square font-bold text-zinc-300 tracking-wider">chatihna</span>
          </div>
          
          <p className="text-xs text-zinc-500 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by 
            <span className="text-zinc-400 hover:text-white transition-colors cursor-default font-semibold">Moroccan Developers</span>
          </p>

          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} chatihna. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
