import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Send, RotateCcw, Save, Sparkles, Shield, Instagram, Facebook } from 'lucide-react';
import { AppConfig } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onResetApp: () => void;
}

// Simple TikTok Icon SVG
const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.23-.42-.48-.6-.75-.12-.17-.23-.35-.33-.53-.02-.04-.04-.08-.07-.12-.09.35-.14.71-.14 1.07v5.22c.04 3.25-1.95 6.35-5.08 7.37-3.1 1.05-6.81-.19-8.48-3.08-1.7-2.87-1.12-6.84 1.34-9.01 1.84-1.65 4.62-2.12 6.94-1.22.01-.84.02-1.68.02-2.52V.02zm-.01 5.92c-1.23-.44-2.65-.21-3.66.69-1.05.92-1.37 2.53-.78 3.82.57 1.29 2.05 2.07 3.45 1.82 1.3-.21 2.33-1.37 2.38-2.69.01-1.21.01-2.42.01-3.63l-1.4-.01z" />
  </svg>
);

export default function AdminDrawer({
  isOpen,
  onClose,
  config,
  onSave,
  onResetApp,
}: AdminDrawerProps) {
  const [instagramUrl, setInstagramUrl] = useState(config.instagramUrl);
  const [instagramHandle, setInstagramHandle] = useState(config.instagramHandle);
  
  const [tiktokUrl, setTiktokUrl] = useState(config.tiktokUrl);
  const [tiktokHandle, setTiktokHandle] = useState(config.tiktokHandle);

  const [facebookUrl, setFacebookUrl] = useState(config.facebookUrl);
  const [facebookHandle, setFacebookHandle] = useState(config.facebookHandle);

  const [verificationInstructions, setVerificationInstructions] = useState(config.verificationInstructions);

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      instagramUrl,
      instagramHandle,
      tiktokUrl,
      tiktokHandle,
      facebookUrl,
      facebookHandle,
      verificationInstructions,
      adminSecret: 'configured',
    });
    
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
      onClose();
    }, 1200);
  };

  const handleRestoreDefaults = () => {
    if (confirm("Restore default active profiles?")) {
      setInstagramUrl("https://www.instagram.com/flopnepal?igsh=OXdxeDZhZmxwdDJ4");
      setInstagramHandle("@flopnepal");
      setTiktokUrl("https://www.tiktok.com/@flopnepal?_r=1&_t=ZS-9761ZKXbeuy");
      setTiktokHandle("@flopnepal");
      setFacebookUrl("https://www.facebook.com/profile.php?id=61580905551987");
      setFacebookHandle("Flop Nepal");
      setVerificationInstructions("Follow Instagram, TikTok & Facebook pages. Copy your generated Claim Ticket below and paste/message it to our official TikTok inbox to receive 10 NPR per followed account.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 select-none">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        />

        {/* Modal Console Body */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-[400px] bg-slate-900 border-t md:border border-slate-800 rounded-t-[32px] md:rounded-[28px] overflow-hidden flex flex-col max-h-[85vh] relative z-20 shadow-2xl"
          id="host-config-drawer"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-800/60 flex items-center justify-between select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  Host Console Panel
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/15">
                    Live Edit
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Update handles and profile targets</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form container */}
          <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            
            {/* Host Alert banner */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-2.5">
              <Shield className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                You can change the target URLs and handles here. The changes take effect instantly. Users will follow these handles to unlock the 10 NPR reward button.
              </p>
            </div>

            {/* Instagram Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 text-[10.5px] font-bold uppercase tracking-wide">
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Profile</span>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Profile URL e.g. https://instagram.com/user"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder="Display Handle e.g. @my_handle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/60 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* TikTok Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-teal-400 text-[10.5px] font-bold uppercase tracking-wide">
                <TikTokIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>TikTok Profile & Claim Target</span>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Profile URL e.g. https://tiktok.com/@user"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder="Display Handle e.g. @tiktok_user"
                  value={tiktokHandle}
                  onChange={(e) => setTiktokHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/60 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Facebook Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 text-[10.5px] font-bold uppercase tracking-wide">
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook Profile</span>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Profile/Page URL e.g. https://facebook.com/page"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder="Display Handle/Name e.g. My Page"
                  value={facebookHandle}
                  onChange={(e) => setFacebookHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/60 rounded-xl py-2 px-3 text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Custom Info Section */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 text-[10.5px] font-bold uppercase tracking-wide">
                Custom Verification Help Note
              </label>
              <textarea
                value={verificationInstructions}
                onChange={(e) => setVerificationInstructions(e.target.value)}
                placeholder="Instructions displayed to users in the claim modal..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 transition-all min-h-[70px] resize-none"
                required
              />
            </div>

            {/* Danger Zone */}
            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <span className="block text-[10.5px] font-bold text-red-400 uppercase tracking-wide">
                Danger Zone & Tools
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-admin-reset-app"
                  onClick={() => {
                    if (confirm("Reset task follows, wallet inputs, and storage to test default user journey?")) {
                      onResetApp();
                      onClose();
                    }
                  }}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs py-2 px-3 rounded-xl border border-red-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All User Progress</span>
                </button>
              </div>
            </div>

          </form>

          {/* Persistent Footer and Action Trigger */}
          <div className="p-5 border-t border-slate-800/60 bg-slate-900/90 flex gap-2.5 shrink-0 select-none">
            <button
              type="button"
              id="btn-restore-defaults"
              onClick={handleRestoreDefaults}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-300 rounded-xl border border-slate-850 font-bold text-xs transition-all cursor-pointer"
            >
              Restore Defaults
            </button>

            <button
              type="button"
              id="btn-save-config"
              onClick={handleSaveSubmit}
              className="flex-1 bg-indigo-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5 transition-all hover:bg-indigo-600 active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{showSaveMessage ? 'Saved Successfully ✓' : 'Save Config Target'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
