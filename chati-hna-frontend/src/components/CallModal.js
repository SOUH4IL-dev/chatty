'use client';
import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

export default function CallModal({ callData, isReceiving, onAnswer, onReject, onEnd, localStream, remoteStream }) {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Remote Video (Main) */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {!remoteStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-10 h-10 text-blue-500" />
              </div>
              <p className="text-xl font-semibold">{isReceiving ? 'Incoming Call...' : 'Calling...'}</p>
              <p className="text-gray-400">{callData?.fromName || callData?.toName}</p>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center space-x-6">
          {isReceiving && !remoteStream ? (
            <>
              <button 
                onClick={onAnswer}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
              >
                <Phone className="w-8 h-8 text-white" />
              </button>
              <button 
                onClick={onReject}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </button>
              <button 
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isVideoOff ? <VideoOff /> : <Video />}
              </button>
              <button 
                onClick={onEnd}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
