"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  ChevronLeft, 
  Cpu, 
  Database, 
  Globe2, 
  ShieldAlert, 
  Clock, 
  Languages,
  Zap,
  Lock,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GeneralSettingsUpgradePage() {
  const [config, setConfig] = useState({
    language: 'Hebrew',
    timezone: 'UTC+3 (Jerusalem)',
    retention: '90 Days'
  });

  const [isCleaning, setIsCleaning] = useState(false);

  const handleCleanCache = () => {
     setIsCleaning(true);
     setTimeout(() => {
        setIsCleaning(false);
        alert('המטמון נוקה בהצלחה! 🧹 124MB פונו מהאחסון המקומי&rlm;.');
     }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* Cinematic Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[40%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[180px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '25px 25px' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                   <Settings size={12} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] text-right">Core v5.1.2</span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter leading-none">הגדרות מערכת ליבה</h1>
             <p className="text-slate-400 font-medium text-lg max-w-xl ml-auto">ניהול התשתית הטכנולוגית והתנהגות המערכת&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Section 1: Infrastructure Stats */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
              <div className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[4px] mb-8 text-right">ביצועי תשתית</h3>
                 
                 <div className="space-y-6">
                    {[
                      { icon: Cpu, label: 'עיבוד AI בלוקאלי', value: 'High Performance', status: 'Optimal' },
                      { icon: Database, label: 'אחסון ענן בשימוש', value: '124 MB / 10 GB', status: 'Healthy' },
                      { icon: Zap, label: 'זמן תגובה ממוצע', value: '12ms', status: 'Ultra Fast' }
                    ].map((stat, i) => (
                      <div key={i} className="text-right group">
                         <div className="flex flex-row-reverse items-center gap-3 mb-2">
                            <stat.icon size={16} className="text-indigo-400" />
                            <span className="text-xs font-black text-white">{stat.label}</span>
                         </div>
                         <div className="flex flex-row-reverse justify-between items-end">
                            <p className="text-lg font-black text-slate-300 transition-colors group-hover:text-white">{stat.value}</p>
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{stat.status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[40px] bg-indigo-600/10 border border-indigo-500/20">
                 <div className="flex flex-row-reverse items-center gap-3 mb-4">
                    <Lock className="text-indigo-400" size={20} />
                    <h4 className="text-white font-black text-sm uppercase tracking-widest">אבטחת נתונים</h4>
                 </div>
                 <p className="text-xs text-slate-400 font-medium text-right leading-relaxed mb-6">
                    הנתונים שלך מוצפנים בצורה מקומית לפני שהם נשלחים לענן&rlm;. מפתחות ההצפנה נמצאים אצלך בלבד&rlm;.
                 </p>
                 <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all">
                    Reset Security Keys
                 </button>
              </div>
           </motion.div>

           {/* Section 2: Configuration Cards */}
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-6">
              
              <section className="bg-[#18181b]/40 border border-white/5 rounded-[48px] p-10 shadow-2xl overflow-hidden relative group">
                 <h2 className="text-2xl font-black text-white mb-10 text-right flex flex-row-reverse items-center gap-4">
                    <Globe2 className="text-indigo-500" />
                    לוקליזציה וזמנים
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 text-right">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2 flex flex-row-reverse items-center gap-2">
                          <Languages size={12} /> שפת ממשק
                       </label>
                       <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-right outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer">
                          <option>עברית (RTL)</option>
                          <option>English (LTR)</option>
                       </select>
                    </div>

                    <div className="space-y-3 text-right">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2 flex flex-row-reverse items-center gap-2">
                          <Clock size={12} /> אזור זמן
                       </label>
                       <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-right outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer">
                          <option>UTC+3 (Jerusalem)</option>
                          <option>UTC+0 (London)</option>
                       </select>
                    </div>
                 </div>
              </section>

              <section className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl">
                 <h2 className="text-2xl font-black text-white mb-10 text-right flex flex-row-reverse items-center gap-4">
                    <HardDrive className="text-amber-500" />
                    ניהול אחסון וארכיון
                 </h2>

                 <div className="space-y-8">
                    <div className="flex flex-row-reverse items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                       <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" />
                       </div>
                       <div className="text-right">
                          <h3 className="font-black text-white mb-1 group-hover:text-amber-300 transition-colors">ארכוב אוטומטי</h3>
                          <p className="text-xs text-slate-500 font-medium">העבר משימות שבוצעו לפני יותר מ-30 יום לארכיון המערכת&rlm;.</p>
                       </div>
                    </div>

                    <div className="flex flex-row-reverse items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                       <button 
                         onClick={handleCleanCache}
                         disabled={isCleaning}
                         className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                       >
                          {isCleaning && <RefreshCw className="animate-spin" size={12} />}
                          <span>{isCleaning ? 'Cleaning...' : 'Clean Now'}</span>
                       </button>
                       <div className="text-right">
                          <h3 className="font-black text-white mb-1">ניקוי מטמון (Cache)</h3>
                          <p className="text-xs text-slate-500 font-medium">פנה מקום מקומי על ידי מחיקת קבצים זמניים&rlm;.</p>
                       </div>
                    </div>
                 </div>
              </section>

              <div className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-8 flex flex-row-reverse items-center justify-between">
                 <div className="text-right">
                    <h4 className="text-red-400 font-black mb-1 flex flex-row-reverse items-center gap-2">
                       <ShieldAlert size={18} /> איפוס הגדרות יצרן
                    </h4>
                    <p className="text-red-400/60 text-xs font-medium">כל ההגדרות יחזרו למצב ברירת המחדל שלהן&rlm;.</p>
                 </div>
                 <button className="text-red-400 font-black text-xs uppercase tracking-[3px] hover:text-red-500 transition-colors">
                    Reset System
                 </button>
              </div>

           </motion.div>
        </div>
      </div>
    </main>
  );
}
