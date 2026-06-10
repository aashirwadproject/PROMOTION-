import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ShieldCheck } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);

  useEffect(() => {
    // Dynamic countdown clock localized to Nepal Standard Time (UTC+5:45)
    const updateClock = () => {
      try {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kathmandu',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setCurrentTime(formatter.format(d));
      } catch (e) {
        // Fallback to local system time if Asia/Kathmandu not supported
        const d = new Date();
        const hours = d.getHours().toString().padStart(2, '0');
        const mins = d.getMinutes().toString().padStart(2, '0');
        setCurrentTime(`${hours}:${mins}`);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Slowly fluctuate battery level for realistic aesthetic
    const batteryRandomizer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 15) return 85;
        return prev - 1;
      });
    }, 180000);

    return () => {
      clearInterval(interval);
      clearInterval(batteryRandomizer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 md:p-6 select-none font-sans overflow-x-hidden">
      {/* Visual decorative background element to make desktop look beautiful */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.06),rgba(0,0,0,0))] pointer-events-none" />

      {/* Outer Phone Bezel - Hidden on small viewports so content natively goes full screen */}
      <div className="w-full max-w-[420px] h-full md:h-[840px] bg-neutral-900 md:rounded-[56px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:border-[12px] md:border-neutral-800 relative flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Dynamic Notch / Island on top (hidden on tiny screens if needed, otherwise matches mobile look) */}
        <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 h-[26px] w-[124px] bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-inner">
          {/* Selfie camera and green mic sensor dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-5 h-1 bg-slate-950 rounded-full" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-12 bg-slate-950 border-b border-slate-900/60 flex items-center justify-between px-6 pt-2 text-xs text-slate-300 font-semibold tracking-tight z-40 select-none shrink-0" id="phone-status-bar">
          {/* Local Nepal Time */}
          <span className="font-mono text-[13px]">{currentTime || '19:55'}</span>
          
          {/* Dynamic Notch space filler for Desktop mock layout */}
          <div className="hidden md:block w-24 h-4"></div>

          {/* Status Icons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono scale-90 tracking-widest uppercase">Ncell 5G</span>
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400">{batteryLevel}%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Screens Content Wrapper */}
        <div className="flex-1 w-full bg-slate-950 text-white flex flex-col relative overflow-y-auto overflow-x-hidden md:rounded-b-[40px]">
          {children}
        </div>

        {/* iOS Soft Bar / Home Indicator mock */}
        <div className="hidden md:block h-6 bg-slate-950 flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-700 rounded-full opacity-60" />
        </div>
      </div>

      {/* Decorative desktop information footer */}
      <p className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 mt-4 tracking-wide font-medium bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-800/40">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
        Promote Smart & Earn Rewards securely. Powered by Nepal's Top Social Hub.
      </p>
    </div>
  );
}
