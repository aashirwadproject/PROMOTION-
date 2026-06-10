import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Facebook, Check, ArrowRight, Loader2, Award, Zap } from 'lucide-react';
import { SocialTask } from '../types';

interface TaskCardProps {
  key?: string;
  task: SocialTask;
  onComplete: (id: string) => void;
  onStartVerification: (id: string) => void;
}

// Simple TikTok Icon SVG since lucide doesn't have a modern TikTok representation
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.23-.42-.48-.6-.75-.12-.17-.23-.35-.33-.53-.02-.04-.04-.08-.07-.12-.09.35-.14.71-.14 1.07v5.22c.04 3.25-1.95 6.35-5.08 7.37-3.1 1.05-6.81-.19-8.48-3.08-1.7-2.87-1.12-6.84 1.34-9.01 1.84-1.65 4.62-2.12 6.94-1.22.01-.84.02-1.68.02-2.52V.02zm-.01 5.92c-1.23-.44-2.65-.21-3.66.69-1.05.92-1.37 2.53-.78 3.82.57 1.29 2.05 2.07 3.45 1.82 1.3-.21 2.33-1.37 2.38-2.69.01-1.21.01-2.42.01-3.63l-1.4-.01z" />
  </svg>
);

export default function TaskCard({ task, onComplete, onStartVerification }: TaskCardProps) {
  const [countdown, setCountdown] = useState<number>(8);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isVerifying && countdown === 0) {
      setIsVerifying(false);
      onComplete(task.id);
    }
    return () => clearTimeout(timer);
  }, [isVerifying, countdown]);

  const handleAction = () => {
    if (task.status === 'idle') {
      // 1. Open the profile URL in a new window/tab as requested
      window.open(task.url, '_blank', 'noopener,noreferrer');
      // 2. Transistion to verifying phase
      onStartVerification(task.id);
      setIsVerifying(true);
      setCountdown(8); // 8-second realistic timer to confirm follow
    }
  };

  const getPlatformStyle = () => {
    switch (task.platform) {
      case 'instagram':
        return {
          gradient: 'from-pink-600 via-rose-500 to-amber-500',
          shadow: 'shadow-pink-500/10 border-rose-500/30',
          icon: <Instagram className="w-5 h-5 text-white" />,
          glow: 'bg-rose-500',
          textColor: 'text-rose-400',
          bgAccent: 'bg-gradient-to-tr from-pink-500/10 to-rose-500/10',
          brandName: 'Instagram'
        };
      case 'tiktok':
        return {
          gradient: 'from-slate-900 via-zinc-800 to-neutral-900 border-zinc-700/60',
          shadow: 'shadow-teal-500/5 shadow-rose-500/5 border-neutral-700/50',
          icon: <TikTokIcon className="w-5 h-5 text-white" />,
          glow: 'bg-teal-400',
          textColor: 'text-teal-400',
          bgAccent: 'bg-neutral-900/40',
          brandName: 'TikTok'
        };
      case 'facebook':
        return {
          gradient: 'from-blue-600 to-indigo-700',
          shadow: 'shadow-blue-500/10 border-blue-500/30',
          icon: <Facebook className="w-5 h-5 text-white" />,
          glow: 'bg-blue-500',
          textColor: 'text-blue-400',
          bgAccent: 'bg-gradient-to-tr from-blue-500/10 to-indigo-500/10',
          brandName: 'Facebook'
        };
    }
  };

  const style = getPlatformStyle();
  const state = task.status;

  const getTaskNumber = () => {
    if (task.id.includes('instagram')) return 'Task 01';
    if (task.id.includes('tiktok')) return 'Task 02';
    return 'Task 03';
  };

  return (
    <motion.div
      layout
      id={`task-card-${task.id}`}
      className="rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-6 transition-all duration-350 relative overflow-hidden active:border-emerald-500/50"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Top Brand Flag & Icons */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg relative`}>
              {style.icon}
              {state === 'completed' && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-zinc-900 shadow">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            {/* Task Number Identifier */}
            <span className="text-xs font-black uppercase tracking-tighter text-zinc-500">
              {getTaskNumber()}
            </span>
          </div>

          {/* Social Platform & Handle */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black tracking-tight text-white uppercase leading-none">
                {style.brandName}
              </h3>
            </div>
            <span className="inline-block text-[11px] bg-zinc-950 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-zinc-800">
              {task.handle}
            </span>
            <p className="text-zinc-400 text-sm mt-2 leading-snug font-medium">
              {task.description}
            </p>
          </div>
        </div>

        {/* Price Tag & Action Trigger */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between gap-4">
          <div className="shrink-0">
            <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Reward
            </span>
            <p className="text-2xl font-black text-emerald-500 leading-none">
              +10 NPR
            </p>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.button
                  key="btn-idle"
                  id={`btn-action-${task.id}`}
                  onClick={handleAction}
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-200 active:scale-98 font-black uppercase text-xs tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>Follow Now</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </motion.button>
              )}

              {isVerifying && (
                <motion.div
                  key="btn-verifying"
                  className="w-full bg-zinc-950 border-2 border-zinc-850 px-3 py-2.5 rounded-xl flex items-center justify-between text-xs text-zinc-300 font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono font-black px-2 py-0.5 rounded">
                    {countdown}s
                  </span>
                </motion.div>
              )}

              {state === 'completed' && (
                <motion.div
                  key="btn-completed"
                  className="w-full bg-emerald-500/10 border-2 border-emerald-500/20 px-3 py-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-black uppercase font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Completed</span>
                  </div>
                  <span className="text-[10px] text-emerald-500">
                    Added
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Embedded warning instruction hint */}
      {state === 'idle' && (
        <span className="block text-[9.5px] text-zinc-550 text-center mt-3.5 font-bold uppercase tracking-wider">
          ⚠️ DO NOT unfollow after verifying, otherwise rewards will be rejected.
        </span>
      )}
    </motion.div>
  );
}
