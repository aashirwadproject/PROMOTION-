import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, MessageSquareCode, Award, Coins, Wallet, Sparkles, Send } from 'lucide-react';
import { AppConfig, RewardClaim } from '../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasksCount: number;
  config: AppConfig;
  allTasksCompleted: boolean;
  shareCount: number;
  onShare: () => void;
  onWhatsAppShare: () => void;
}

export default function ClaimModal({
  isOpen,
  onClose,
  completedTasksCount,
  config,
  allTasksCompleted,
  shareCount,
  onShare,
  onWhatsAppShare,
}: ClaimModalProps) {
  const [walletType, setWalletType] = useState<'esewa' | 'khalti' | 'bank'>('esewa');
  const [walletNumber, setWalletNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [claimCode, setClaimCode] = useState<string>('');

  const rewardNpr = completedTasksCount * 10;

  // Generate or retrieve persistent claim code
  useEffect(() => {
    let savedCode = localStorage.getItem('social_claim_code');
    if (!savedCode) {
      const randHex = Math.floor(100000 + Math.random() * 900000).toString();
      savedCode = `NPR-FLLW-${randHex}`;
      localStorage.setItem('social_claim_code', savedCode);
    }
    setClaimCode(savedCode);
  }, []);

  const getCopyMessage = () => {
    const paymentStr = walletNumber 
      ? `\n💳 Payment Wallet: ${walletType.toUpperCase()} (${walletNumber})${accountName ? ` - Name: ${accountName}` : ''}`
      : '\n💳 Payment Details: [I will specify in chat]';
    
    return `Namaste! I have completed ${completedTasksCount} follow tasks.${paymentStr}\n🔑 Claim Verification Ticket: ${claimCode}\n💰 Reward Amount: Rs. ${rewardNpr} NPR (Rs. 10 per task).`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCopyMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTikTok = () => {
    // Open the Tiktok URL directly
    window.open(config.tiktokUrl, '_blank', 'noopener,noreferrer');
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
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal content sliding up */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-[400px] bg-zinc-900 border-t-2 md:border-2 border-zinc-800 rounded-t-[32px] md:rounded-[28px] overflow-hidden flex flex-col max-h-[85vh] relative z-10 shadow-2xl"
          id="claim-reward-modal"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b-2 border-zinc-805 flex items-center justify-between select-none shrink-0" id="claim-modal-head">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-white font-black text-base tracking-tight uppercase">Claim NPR Reward</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-zinc-800/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            
            {/* Wallet Dashboard summary */}
            <div className="relative overflow-hidden bg-zinc-950 rounded-2xl border-2 border-zinc-800 p-4 flex items-center justify-between" id="wallet-summary-card">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase font-sans">
                  Total Pending Earnings
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white tracking-tight font-mono">
                    Rs. {rewardNpr}
                  </span>
                  <span className="text-emerald-500 text-xs font-black font-mono font-sans">NPR</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight font-sans">
                  Rate: Rs. 10 per active follow
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-inner">
                <Coins className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Verification instructions indicator */}
            <div className="p-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-black uppercase tracking-wider">Step-by-Step Instructions</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-semibold uppercase tracking-tight">
                To retrieve payment, copy the ticket template below and send it via DM to tiktok handle: <strong className="text-white font-mono lowercase">@{config.tiktokHandle}</strong>. Send task screenshots if asked by the admin.
              </p>
            </div>

            {/* Payment Wallet Setup (eSewa / Khalti is extremely popular in Nepal) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-zinc-450 tracking-wide uppercase">
                Choose Nepalese Mobile Wallet
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="wallet-esewa"
                  onClick={() => setWalletType('esewa')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-center font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    walletType === 'esewa'
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-black'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-mono">eSewa</span>
                </button>

                <button
                  type="button"
                  id="wallet-khalti"
                  onClick={() => setWalletType('khalti')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-center font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    walletType === 'khalti'
                      ? 'bg-white text-zinc-950 border-white font-black'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-mono">Khalti</span>
                </button>

                <button
                  type="button"
                  id="wallet-bank"
                  onClick={() => setWalletType('bank')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-center font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    walletType === 'bank'
                      ? 'bg-zinc-800 text-white border-zinc-700 font-black'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-mono">Bank</span>
                </button>
              </div>

              {/* Input for Wallet ID */}
              <div className="space-y-2" id="wallet-details-fields">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    id="input-wallet-number"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    placeholder={
                      walletType === 'bank' 
                        ? 'Enter Account Number & Bank Name' 
                        : `Enter your 10-digit ${walletType === 'esewa' ? 'eSewa' : 'Khalti'} ID`
                    }
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-2 px-3 pl-9 text-zinc-300 text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono font-bold"
                  />
                </div>

                <input
                  type="text"
                  id="input-account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Receiver Account Name (Mandatory)"
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-2 px-3 text-zinc-300 text-xs focus:outline-none focus:border-emerald-500 transition-all font-bold"
                />
              </div>
            </div>

            {/* Generated Message Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-440 tracking-wide uppercase">
                  Message Ticket Template
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Ticket Code: {claimCode}</span>
              </div>

              <div className="p-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl relative group">
                <p className="text-zinc-400 text-xs font-mono select-all leading-normal whitespace-pre-wrap break-all pr-8 font-bold">
                  {getCopyMessage()}
                </p>
                <button
                  type="button"
                  id="btn-copy-template"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 w-8 h-8 rounded bg-zinc-900 border border-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Action Footer Buttons */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-2 shrink-0 select-none">
            
            {shareCount < 10 ? (
              <div className="space-y-3" id="share-modal-locked-actions">
                <div className="px-4 py-3 bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 rounded-2xl text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <span>⚠️ Share to 10 Friends on WhatsApp to Unlock ({shareCount}/10 completed)</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onWhatsAppShare}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black tracking-wider uppercase text-xs py-4 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-98"
                    id="btn-whatsapp-modal-action"
                  >
                    <MessageSquareCode className="w-4 h-4" />
                    <span>Share on WhatsApp (At Once)</span>
                  </button>

                  <button
                    onClick={onShare}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 font-extrabold text-[11px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    id="btn-copy-modal-action"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Copy Normal Share Link</span>
                  </button>
                </div>

                <span className="text-[9.5px] text-zinc-500 text-center block font-bold uppercase tracking-tight">
                  * Complete the required 10 WhatsApp shares to unlock eSewa / Khalti payout ticket.
                </span>
              </div>
            ) : (
              <>
                {/* Copy button with status info */}
                <button
                  onClick={handleCopy}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 cursor-pointer transition-all ${
                    copied 
                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-950" />
                      <span>Template Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Ticket Template</span>
                    </>
                  )}
                </button>

                {/* Messenger target TikTok Button */}
                <button
                  onClick={handleOpenTikTok}
                  className="w-full bg-emerald-500 text-zinc-950 font-black tracking-wider uppercase text-xs py-3.5 px-4 rounded-xl shadow-lg border-2 border-transparent hover:bg-emerald-400 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  id="btn-send-tiktok"
                >
                  <Send className="w-4 h-4 stroke-[3]" />
                  <span>Send Message on TikTok</span>
                </button>

                <span className="text-[9.5px] text-zinc-500 text-center mt-1 font-bold uppercase tracking-tight">
                  * Reward requires manual approval based on follow status.
                </span>
              </>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
