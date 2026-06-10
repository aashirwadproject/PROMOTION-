/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Coins, 
  Share2, 
  ShieldCheck, 
  Settings, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  FileText, 
  Check, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Wallet,
  MessageSquare
} from 'lucide-react';

import PhoneFrame from './components/PhoneFrame';
import TaskCard from './components/TaskCard';
import ClaimModal from './components/ClaimModal';
import AdminDrawer from './components/AdminDrawer';
import { AppConfig, SocialTask, TaskStatus } from './types';

// Default configuration for the social assets and handles
const DEFAULT_CONFIG: AppConfig = {
  instagramUrl: "https://www.instagram.com/flopnepal?igsh=OXdxeDZhZmxwdDJ4",
  instagramHandle: "@flopnepal",
  tiktokUrl: "https://www.tiktok.com/@flopnepal?_r=1&_t=ZS-9761ZKXbeuy",
  tiktokHandle: "@flopnepal",
  facebookUrl: "https://www.facebook.com/profile.php?id=61580905551987",
  facebookHandle: "Flop Nepal",
  verificationInstructions: "Follow Instagram, TikTok & Facebook pages. Copy your generated Claim Ticket below and paste/message it to our official TikTok inbox to receive 10 NPR per followed account.",
  adminSecret: "admin",
};

export default function App() {
  // App Config states (persisted locally)
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('social_app_config_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it's the old template handle, upgrade automatically
        if (parsed.instagramHandle === "@aashirwad_promotions" || parsed.tiktokHandle === "@aashirwad_promotions") {
          localStorage.setItem('social_app_config_data', JSON.stringify(DEFAULT_CONFIG));
          return DEFAULT_CONFIG;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    localStorage.setItem('social_app_config_data', JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  });

  // Track completed tasks IDs (persisted locally)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('social_completed_task_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Track website share counts for the withdrawal requirement
  const [shareCount, setShareCount] = useState<number>(() => {
    const saved = localStorage.getItem('social_share_count');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  // Track verifying tasks IDs
  const [verifyingTaskIds, setVerifyingTaskIds] = useState<string[]>([]);

  // UI state managers
  const [isClaimOpen, setIsClaimOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'how-it-works'>('tasks');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Dynamic lists of payout news ticker messages
  const liveTickerPayouts = [
    { name: "Suresh B.", amount: "30 NPR", app: "eSewa", time: "1m ago" },
    { name: "Prerna K.", amount: "10 NPR", app: "Khalti", time: "3m ago" },
    { name: "Aashish R.", amount: "20 NPR", app: "eSewa", time: "8m ago" },
    { name: "Gita S.", amount: "30 NPR", app: "IME Pay", time: "14m ago" },
    { name: "Rishav M.", amount: "10 NPR", app: "Khalti", time: "22m ago" },
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  // Rotate the ticker feed to emulate a lively community
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickerPayouts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save changes to config to LocalStorage
  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('social_app_config_data', JSON.stringify(newConfig));
    triggerToast("Host configuration updated successfully!");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Convert raw config and status into task items
  const getTasksList = (): SocialTask[] => {
    return [
      {
        id: 'instagram-follow',
        platform: 'instagram',
        title: 'Follow Instagram',
        description: 'Follow and support on Instagram',
        handle: config.instagramHandle,
        url: config.instagramUrl,
        rewardNpr: 10,
        status: completedTaskIds.includes('instagram-follow')
          ? 'completed'
          : verifyingTaskIds.includes('instagram-follow')
          ? 'verifying'
          : 'idle',
      },
      {
        id: 'tiktok-follow',
        platform: 'tiktok',
        title: 'Follow TikTok',
        description: 'Follow and support on TikTok',
        handle: config.tiktokHandle,
        url: config.tiktokUrl,
        rewardNpr: 10,
        status: completedTaskIds.includes('tiktok-follow')
          ? 'completed'
          : verifyingTaskIds.includes('tiktok-follow')
          ? 'verifying'
          : 'idle',
      },
      {
        id: 'facebook-follow',
        platform: 'facebook',
        title: 'Like Facebook Page',
        description: 'Follow and support on Facebook',
        handle: config.facebookHandle,
        url: config.facebookUrl,
        rewardNpr: 10,
        status: completedTaskIds.includes('facebook-follow')
          ? 'completed'
          : verifyingTaskIds.includes('facebook-follow')
          ? 'verifying'
          : 'idle',
      },
    ];
  };

  const tasksList = getTasksList();
  const completedCount = completedTaskIds.length;
  const totalRewardEstimate = completedCount * 10;
  const progressPercent = Math.round((completedCount / tasksList.length) * 100);

  // Trigger task verification state
  const handleStartVerification = (taskId: string) => {
    setVerifyingTaskIds((prev) => [...prev, taskId]);
  };

  // Mark task as fully completed
  const handleCompleteTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      if (prev.includes(taskId)) return prev;
      const updated = [...prev, taskId];
      localStorage.setItem('social_completed_task_ids', JSON.stringify(updated));
      return updated;
    });
    setVerifyingTaskIds((prev) => prev.filter((id) => id !== taskId));
    triggerToast("Earned 10 NPR! Unlock Reward Button activated.");
  };

  // Complete reset to restart the testing cycle
  const handleResetApp = () => {
    setCompletedTaskIds([]);
    setVerifyingTaskIds([]);
    setShareCount(0);
    localStorage.removeItem('social_completed_task_ids');
    localStorage.removeItem('social_share_count');
    localStorage.removeItem('social_claim_code');
    triggerToast("Application progress restored.");
  };

  const handleShareWebsite = () => {
    const shareUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCount((prev) => {
        const next = Math.min(10, prev + 1);
        localStorage.setItem('social_share_count', String(next));
        if (next === 10) {
          triggerToast("🎉 Magnificent! 10 shares obtained! Withdrawal fully unlocked!");
        } else {
          triggerToast(`🔗 Link copied! Share with your friends. Progress: ${next}/10`);
        }
        return next;
      });
    }).catch(() => {
      setShareCount((prev) => {
        const next = Math.min(10, prev + 1);
        localStorage.setItem('social_share_count', String(next));
        triggerToast(`Progress registered! Share count: ${next}/10`);
        return next;
      });
    });
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.origin + window.location.pathname;
    const shareText = `🇳🇵 *Earn 10 NPR per followed page instantly!* 💰 Join the Flop Nepal Social Quest now. Direct payouts to eSewa & Khalti! Start earning here:\n${shareUrl}`;
    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    
    // Open standard WhatsApp sharing intent
    window.open(whatsappUrl, '_blank');
    
    // Complete 10 shares requirement at one time
    setShareCount(10);
    localStorage.setItem('social_share_count', '10');
    triggerToast("🎉 WhatsApp sharing complete! 10 Shares registered at once. Withdrawal unlocked!");
  };

  return (
    <PhoneFrame>
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 z-[60] bg-indigo-600 border border-indigo-400 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold select-none"
          >
            <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Header Navigation */}
      <header className="px-5 pt-6 pb-4 bg-zinc-950 border-b-2 border-zinc-900 sticky top-0 backdrop-blur-md z-40 flex items-center justify-between select-none shrink-0" id="header-quest-theme">
        <div className="border-l-4 border-emerald-500 pl-3">
          <p className="text-emerald-500 font-mono text-[10px] tracking-widest uppercase mb-0.5">Available Quests</p>
          <h1 className="text-2xl font-black tracking-tighter leading-none uppercase text-white">
            Social<br />Quest
          </h1>
        </div>

        {/* Your Balance Dashboard on the header right */}
        <div className="flex items-center gap-2">
          <div className="bg-white text-zinc-950 px-3.5 py-2 rounded-2xl text-right shadow-md">
            <p className="text-[8.5px] font-black uppercase tracking-widest opacity-60 leading-none mb-0.5">Your Balance</p>
            <p className="text-base font-black leading-tight font-mono">
              {totalRewardEstimate}.00 <span className="text-[10px] font-bold">NPR</span>
            </p>
          </div>

          {/* Administration Gear Console */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900 border-2 border-zinc-805 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            header-btn-config="true"
            title="Host handles configuration console"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-5 space-y-5 flex-1">
        
        {/* Dynamic community live claim payouts ticker */}
        <div className="bg-zinc-900 border-2 border-zinc-800 px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-[11px] overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-500 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase font-mono text-[10px]">Claims Feed:</span>
          </div>
          <div className="flex-1 font-sans text-zinc-400 relative h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={tickerIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="w-full truncate text-[11px] font-bold uppercase transition-all"
              >
                🇳🇵 {liveTickerPayouts[tickerIndex].name} claimed{' '}
                <strong className="text-white">{liveTickerPayouts[tickerIndex].amount}</strong>{' '}
                to <strong className="text-emerald-400">{liveTickerPayouts[tickerIndex].app}</strong>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* User Balance Cards Box & Progress Display */}
        <section className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 relative overflow-hidden" id="metric-banner-panel">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider font-sans">
                Accumulated earnings
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white tracking-tight font-mono">
                  Rs. {totalRewardEstimate}
                </span>
                <span className="text-sm font-black text-emerald-500 font-mono">NPR</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500">
              <Award className="w-5 h-5 animate-bounce" />
            </div>
          </div>

          {/* Quick Withdraw Funds Action Button */}
          <div className="mt-4">
            <button
              onClick={() => {
                if (completedCount === 0) {
                  triggerToast("⚠️ Follow at least 1 page to accumulate earnings before withdrawing.");
                } else if (shareCount < 10) {
                  triggerToast("⚠️ Withdrawal Locked! Please share to 10 friends on WhatsApp to unlock.");
                } else {
                  setIsClaimOpen(true);
                }
              }}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 ${
                completedCount > 0 && shareCount === 10
                  ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-black cursor-pointer shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-950 text-zinc-500 hover:text-zinc-400 border border-zinc-805 cursor-pointer'
              }`}
              id="btn-balance-withdraw"
            >
              <Wallet className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </button>
          </div>

          {/* Progress tracker metrics */}
          <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-tight">
              <span className="text-zinc-450">Active followers quest</span>
              <span className="text-emerald-500 font-mono">
                {completedCount} / {tasksList.length} Completed
              </span>
            </div>

            {/* Progress gauge bar removed */}

            <p className="text-[10.5px] text-zinc-400 font-bold uppercase tracking-tight leading-relaxed">
              Unlock the massive payouts button by following each social asset below. Rs. 10 per active task.
            </p>
          </div>
              {/* Withdrawal Requirement: Share Website to 10 People */}
        <section className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 relative overflow-hidden" id="share-withdrawal-card-requirement">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-wider font-sans block">
                Withdrawal Mandatory Requirement
              </span>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                WhatsApp Sharing Requirement
              </h2>
            </div>
            
            <div className={`w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${shareCount === 10 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-500 animate-pulse'}`}>
              <Share2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-tight">
              <span className="text-zinc-400">Share Progress</span>
              <span className={shareCount === 10 ? 'text-emerald-500 font-mono' : 'text-amber-500 font-mono'}>
                {shareCount} / 10 SHARES ON WHATSAPP
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                id="btn-whatsapp-share-at-once"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-[#25D366] hover:bg-[#128C7E] text-white cursor-pointer shadow-lg active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share 10 Friends on WhatsApp (At Once)</span>
              </button>
            </div>

            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight leading-normal">
              Warning: Withdrawal is locked until you share the website link to 10 friends on WhatsApp. Complete at one time above!
            </p>
          </div>
        </section>    </section>

        {/* Dashboard Tabs for Navigation */}
        <section className="space-y-4">
          <div className="flex bg-zinc-950 p-1.5 rounded-2xl border-2 border-zinc-900">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white text-zinc-950 shadow'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Follow Tasks ({tasksList.length})
            </button>
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'how-it-works'
                  ? 'bg-white text-zinc-950 shadow'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              How It Works
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'tasks' ? (
              <motion.div
                key="tab-tasks"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
                id="task-list-section"
              >
                {/* Section title alert */}
                <div className="flex items-center justify-between text-xs px-1 select-none font-black uppercase tracking-wider">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Promo Action List
                  </span>
                  <span className="text-emerald-500 font-mono">10 NPR / TASK</span>
                </div>

                {/* Render cards array */}
                {tasksList.map((taskOrItem) => (
                  <TaskCard
                    key={taskOrItem.id}
                    task={taskOrItem}
                    onComplete={handleCompleteTask}
                    onStartVerification={handleStartVerification}
                  />
                ))}

              </motion.div>
            ) : (
              <motion.div
                key="tab-faq"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4 bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 text-xs leading-relaxed text-zinc-300"
                id="faq-list-section"
              >
                <h4 className="text-white font-black text-base tracking-tight mb-3 flex items-center gap-1.5 text-emerald-500 uppercase">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Promo Rules & Payouts
                </h4>

                <div className="space-y-4 font-medium">
                  <div className="space-y-1">
                    <p className="font-black text-white uppercase text-xs tracking-tight">Q1: How do I claim the 10 NPR per task?</p>
                    <p className="text-zinc-400">
                      Simply hit the follow buttons to open our pages on Instagram, TikTok & Facebook. After staying for at least 8 seconds or following, return here. The reward gets unlocked!
                    </p>
                  </div>

                  <div className="space-y-1 border-t border-zinc-800 pt-3">
                    <p className="font-black text-white uppercase text-xs tracking-tight">Q2: What is the message on TikTok rule?</p>
                    <p className="text-zinc-400">
                      As requested by the creator, clicked tasks unlock the "Reward Access Button". Clicking it allows choosing eSewa/Khalti, copying your ticket templates, and letting you message the admin directly on TikTok to retrieve the money.
                    </p>
                  </div>

                  <div className="space-y-1 border-t border-zinc-805 pt-3">
                    <p className="font-black text-white uppercase text-xs tracking-tight">Q3: How long after messaging will payment take?</p>
                    <p className="text-zinc-400">
                      Verification takes 1 to 12 hours once you initiate direct contact with our verification ticket. Ensure your profiles are public so we can cross-reference!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Custom locked instructions or alert about rewards */}
        <section className="bg-zinc-900/40 border-2 border-zinc-800 rounded-3xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="text-white font-black uppercase tracking-tight">Guaranteed Legit Promotion</span>
            <p className="text-zinc-400 leading-relaxed font-semibold">
              We process each ticket manually. Cheating, deleting follows, or sending false receipts results in automatic wallet bans. Play fair!
            </p>
          </div>
        </section>

      </main>

      {/* Sticky Bottom Action Reward Access Panel */}
      <footer className="p-5 bg-zinc-950 border-t-2 border-zinc-900 sticky bottom-0 z-40 shrink-0 select-none">
        
        <AnimatePresence mode="wait">
          {completedCount > 0 ? (
            <motion.div
              key="claim-unlocked"
              className="space-y-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              id="sticky-claim-panel-unlocked"
            >
              {/* Little info alert above button */}
              <div className="flex items-center justify-between px-3 text-xs font-black uppercase tracking-tight bg-emerald-500/10 border-2 border-emerald-500/20 rounded-xl py-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">{completedCount} tasks unlocked</span>
                </div>
                <span className="font-mono text-white">Rs. {totalRewardEstimate} Ready</span>
              </div>

              {/* Magnificent pulsating Reward Access Claim Button */}
              <button
                type="button"
                id="btn-claim-reward-access"
                onClick={() => setIsClaimOpen(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider py-4 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer shadow-lg border-2 border-transparent"
              >
                <Sparkles className="w-4 h-4 text-zinc-950 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Claim Reward Ticket ({totalRewardEstimate} NPR)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="claim-locked"
              id="sticky-claim-panel-locked"
              className="bg-zinc-900 border-2 border-zinc-805 px-4 py-3.5 rounded-2xl flex items-center justify-between text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-450 font-black block uppercase text-[10px] tracking-wider leading-none mb-1">Reward Access Locked</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Follow pages to unlock rewards</span>
                </div>
              </div>
              <span className="text-[10px] bg-zinc-950 text-zinc-400 px-2.5 py-1.5 rounded-lg border border-zinc-800 font-mono font-black">
                {completedCount} / {tasksList.length} DONE
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </footer>

      {/* Claim Modal overlay */}
      <ClaimModal
        isOpen={isClaimOpen}
        onClose={() => setIsClaimOpen(false)}
        completedTasksCount={completedCount}
        config={config}
        allTasksCompleted={completedCount === tasksList.length}
        shareCount={shareCount}
        onShare={handleShareWebsite}
        onWhatsAppShare={handleWhatsAppShare}
      />

      {/* Host Administrator target configuration console drawer */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        onResetApp={handleResetApp}
      />
    </PhoneFrame>
  );
}
