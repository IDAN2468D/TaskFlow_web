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
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCleanCache = () => {
     setIsCleaning(true);
     setTimeout(() => {
        setIsCleaning(false);
        alert('המטמון נוקה בהצלחה! 🧹 124MB פונו מהאחסון המקומי\u200F.');
     }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 p-6 md:p-12 overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* Premium Obsidian Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] noise-overlay" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-20">
           <div className="text-right">
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-row-reverse items-center gap-3 mb-4"
             >
                <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2 backdrop-blur-md">
                   <Settings size={12} className="text-indigo-400" />
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px] text-right">Settings Engine v6.0</span>
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-none"
             >
               הגדרות מערכת
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-slate-400 font-medium text-lg md:text-xl max-w-xl ml-auto leading-relaxed"
             >
               ניהול התשתית הטכנולוגית והתנהגות ה-Intelligence OS שלך&rlm;.
             </motion.p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-xl hover:scale-110 active:scale-95 shadow-2xl border-obsidian">
             <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-white rotate-180 transition-transform" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
           
           {/* Section 1: Infrastructure Stats */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }} 
             animate={{ opacity: 1, x: 0 }} 
             className="lg:col-span-4 space-y-6 md:space-y-8"
           >
              <div className="glass-premium border-obsidian rounded-[32px] md:rounded-[48px] p-6 md:p-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 text-indigo-500/5 hidden md:block">
                    <Cpu size={140} />
                 </div>
                 
                 <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[4px] md:tracking-[6px] mb-8 md:mb-12 text-right relative z-10">System Telemetry</h3>
                 
                 <div className="space-y-8 md:space-y-10 relative z-10">
                    {[
                      { icon: Cpu, label: 'עיבוד AI בלוקאלי', value: 'High Performance', status: 'Optimal', color: 'indigo' },
                      { icon: Database, label: 'אחסון ענן בשימוש', value: '124 MB / 10 GB', status: 'Healthy', color: 'blue' },
                      { icon: Zap, label: 'זמן תגובה ממוצע', value: '12ms', status: 'Ultra Fast', color: 'amber' }
                    ].map((stat, i) => (
                      <div key={i} className="text-right group/item">
                         <div className="flex flex-row-reverse items-center gap-3 mb-2 md:mb-3">
                            <div className={`p-2 bg-${stat.color}-500/10 rounded-lg border border-${stat.color}-500/20`}>
                               <stat.icon size={14} className={`text-${stat.color}-400`} />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-400 group-hover/item:text-slate-200 transition-colors">{stat.label}</span>
                         </div>
                         <div className="flex flex-row-reverse justify-between items-end">
                            <p className="text-lg md:text-xl font-black text-white tracking-tight">{stat.value}</p>
                            <span className={`text-[8px] md:text-[9px] font-black text-${stat.status === 'Optimal' ? 'indigo' : stat.status === 'Healthy' ? 'emerald' : 'amber'}-400 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md`}>
                               {stat.status}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                 <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                 
                 <div className="flex flex-row-reverse items-center gap-4 mb-6 relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center border border-indigo-500/30">
                       <Lock className="text-indigo-400" size={20} />
                    </div>
                    <h4 className="text-white font-black text-base md:text-lg tracking-tight">אבטחת נתונים</h4>
                 </div>
                 <p className="text-xs md:text-sm text-slate-400 font-medium text-right leading-relaxed mb-6 md:mb-8 relative z-10">
                    הנתונים שלך מוצפנים בצורה מקומית בתקן AES-256&rlm;. מפתחות ההצפנה המורחבים נמצאים בניהולך הבלעדי&rlm;.
                 </p>
                 <button className="w-full py-4 md:py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl md:rounded-2xl text-white font-black text-[10px] md:text-xs uppercase tracking-[2px] md:tracking-[3px] transition-all relative z-10 hover:shadow-indigo-500/10 hover:shadow-2xl">
                    Reset Security Architecture
                 </button>
              </div>
           </motion.div>

           {/* Section 2: Configuration Cards */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ delay: 0.1 }}
             className="lg:col-span-8 space-y-8 md:space-y-10"
           >
              
              <section className="glass-premium border-obsidian rounded-[40px] md:rounded-[56px] p-6 md:p-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <h2 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-12 text-right flex flex-row-reverse items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-indigo-500/20">
                       <Globe2 className="text-indigo-400 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    לוקליזציה וזמנים
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-3 md:space-y-4 text-right">
                       <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[3px] md:tracking-[4px] mr-2 flex flex-row-reverse items-center gap-3">
                          <Languages size={14} className="text-indigo-500" /> שפת ממשק המערכת
                       </label>
                       <div className="relative group/select">
                          <select className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-right outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none cursor-pointer text-base md:text-lg hover:bg-white/[0.08]">
                             <option className="bg-[#0f172a]">עברית (RTL)</option>
                             <option className="bg-[#0f172a]">English (LTR)</option>
                          </select>
                          <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-indigo-400 transition-colors">
                             <ChevronLeft className="-rotate-90 w-[18px] h-[18px] md:w-5 md:h-5" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3 md:space-y-4 text-right">
                       <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[3px] md:tracking-[4px] mr-2 flex flex-row-reverse items-center gap-3">
                          <Clock size={14} className="text-indigo-500" /> סנכרון אזור זמן
                       </label>
                       <div className="relative group/select">
                          <select className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-right outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none cursor-pointer text-base md:text-lg hover:bg-white/[0.08]">
                             <option className="bg-[#0f172a]">UTC+3 (Jerusalem)</option>
                             <option className="bg-[#0f172a]">UTC+0 (London)</option>
                             <option className="bg-[#0f172a]">UTC-5 (New York)</option>
                          </select>
                          <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-indigo-400 transition-colors">
                             <ChevronLeft className="-rotate-90 w-[18px] h-[18px] md:w-5 md:h-5" />
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              <section className="glass-premium border-obsidian rounded-[40px] md:rounded-[56px] p-6 md:p-12 shadow-2xl relative overflow-hidden group">
                 <h2 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-12 text-right flex flex-row-reverse items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-amber-500/20">
                       <HardDrive className="text-amber-400 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    ניהול אחסון וארכיון
                 </h2>

                 <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row-reverse items-end md:items-center justify-between p-6 md:p-8 rounded-[28px] md:rounded-[36px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/item gap-4">
                       <div className="flex flex-row-reverse items-center gap-4 md:gap-8 text-right">
                          <div>
                             <h3 className="text-lg md:text-xl font-black text-white mb-1 md:mb-2 group-hover/item:text-indigo-300 transition-colors">ארכוב אוטומטי חכם</h3>
                             <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md">בצע העברה אוטומטית של משימות ישנות לארכיון המערכת כדי לשמור על ביצועים&rlm;.</p>
                          </div>
                       </div>
                       <button className="w-14 md:w-16 h-7 md:h-8 bg-indigo-600 rounded-full relative shadow-inner shadow-black/20">
                          <motion.div 
                            layout
                            className="absolute top-1 left-1 w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-lg translate-x-7 md:translate-x-8" 
                          />
                       </button>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse items-end md:items-center justify-between p-6 md:p-8 rounded-[28px] md:rounded-[36px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/item gap-4">
                       <div className="text-right">
                          <h3 className="text-lg md:text-xl font-black text-white mb-1 md:mb-2">ניקוי מטמון (Cache Engine)</h3>
                          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md">פינוי זיכרון מקומי ושיפור זמני הטעינה של ממשק המשתמש&rlm;.</p>
                       </div>
                       <button 
                         onClick={handleCleanCache}
                         disabled={isCleaning}
                         className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-[2px] md:tracking-[3px] hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center gap-3 group/btn"
                       >
                          {isCleaning ? (
                            <RefreshCw className="animate-spin text-indigo-400 group-hover/btn:text-white w-4 h-4 md:w-[18px] md:h-[18px]" />
                          ) : (
                            <Zap className="text-amber-400 group-hover/btn:text-white w-4 h-4 md:w-[18px] md:h-[18px]" />
                          )}
                          <span>{isCleaning ? 'Processing...' : 'Clean Cache'}</span>
                       </button>
                    </div>
                 </div>
              </section>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-red-500/5 border border-red-500/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10 flex flex-col md:flex-row-reverse items-end md:items-center justify-between group overflow-hidden relative gap-6"
              >
                 <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="text-right relative z-10">
                    <h4 className="text-xl md:text-2xl text-red-400 font-black mb-1 md:mb-2 flex flex-row-reverse items-center gap-3">
                       <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" /> איפוס הגדרות יצרן
                    </h4>
                    <p className="text-red-400/60 text-xs md:text-sm font-medium">זהירות: כל העדפות המערכת יאופסו להגדרות הליבה המקוריות&rlm;.</p>
                 </div>
                 <button className="relative z-10 w-full md:w-auto bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[3px] md:tracking-[4px] transition-all border border-red-500/20">
                    Factory Reset
                 </button>
              </motion.div>

           </motion.div>
        </div>
      </div>
    </main>
  );
}

