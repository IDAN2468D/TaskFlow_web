"use client";

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Target, 
  MessageSquare, 
  Activity, 
  Mic, 
  Volume2, 
  Sliders,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONALITIES = [
  { id: 'professional', name: 'מקצועי (Strategic)', desc: 'דגש על יעילות וקיצורי דרך', icon: Target },
  { id: 'friendly', name: 'חברותי (Friendly)', desc: 'מעודד ומדרבן בתקופות עומס', icon: MessageSquare },
  { id: 'minimalist', name: 'מינימליסט (Direct)', desc: 'מינימום מילים, מקסימום ביצוע', icon: Zap }
];

export default function AIAssistantPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [decompLevel, setDecompLevel] = useState(75);
  const [personality, setPersonality] = useState('professional');
  const [autoMode, setAutoMode] = useState(true);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* AI Pulse Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Engine v6.1</span>
                <Cpu size={14} className="text-indigo-500 animate-spin-slow" />
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">עוזר אישי AI</h1>
             <p className="text-slate-400 font-medium text-lg text-right">התאמת המוח הדיגיטלי לסגנון העבודה האישי שלך&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Section 1: AI Brain State */}
           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
              <div className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 relative overflow-hidden">
                 <div className="flex flex-row-reverse items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">מצב נוירולוגי</h3>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                 </div>
                 
                 <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative mb-6">
                       <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin-slow" />
                       <BrainCircuit size={80} className="text-indigo-400" />
                    </div>
                    <p className="text-sm font-black text-white">סינכרון מלא: 98.4%</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">הסוכן מוכן לבצע משימות מורכבות&rlm;</p>
                 </div>

                 <button 
                  onClick={handleSync}
                  className="mt-8 w-full bg-white/5 border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                 >
                    {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : 'רענון תובנות'}
                 </button>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/10 rounded-[40px] p-8 group hover:bg-amber-500/20 transition-all cursor-pointer">
                 <div className="flex flex-row-reverse items-center justify-between mb-4">
                    <h3 className="text-white font-black">תובנת AI שעתית</h3>
                    <Sparkles size={18} className="text-amber-400" />
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed text-right">{"זיהיתי ירידה בריכוז בשעה הזו בימי שלישי. ממליץ להעביר את משימות ה-Dev הכבדות לשעות הבוקר."}</p>
              </div>
           </motion.div>

           {/* Section 2: Advanced Controls */}
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
              {/* Personality Matrix */}
              <div className="bg-[#18181b]/40 border border-white/5 rounded-[48px] p-10 overflow-hidden">
                 <h3 className="text-xl font-black text-white mb-8 text-right flex flex-row-reverse items-center gap-3">
                    <Target className="text-indigo-500" />
                    מטריצת אישיות הסוכן
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PERSONALITIES.map((p) => (
                      <button 
                         key={p.id}
                         onClick={() => setPersonality(p.id)}
                         className={`p-6 rounded-[32px] border transition-all text-right relative overflow-hidden group ${personality === p.id ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                      >
                         <p.icon size={24} className={`mb-4 ${personality === p.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                         <h4 className={`font-black text-sm mb-1 ${personality === p.id ? 'text-white' : 'text-slate-300'}`}>{p.name}</h4>
                         <p className={`text-[10px] font-medium leading-tight ${personality === p.id ? 'text-indigo-100' : 'text-slate-500'}`}>{p.desc}</p>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Behavior & Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Decomposition Slack */}
                 <div className="bg-[#18181b]/40 border border-white/5 rounded-[48px] p-8">
                    <div className="flex flex-row-reverse items-center justify-between mb-8">
                       <h4 className="text-sm font-black text-white">עומק פירוק משימה</h4>
                       <Sliders size={18} className="text-indigo-400" />
                    </div>
                    <div className="space-y-6">
                       <div className="flex flex-row-reverse justify-between text-[10px] font-black text-slate-500">
                          <span>מקסימלי</span>
                          <span>מינימלי</span>
                       </div>
                       <input 
                        type="range" 
                        min="0" max="100" 
                        value={decompLevel}
                        onChange={(e) => setDecompLevel(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500" 
                       />
                       <p className="text-[11px] text-slate-500 font-medium text-right bg-white/5 p-4 rounded-2xl border border-white/5">
                          משימות יפורקו ל-{decompLevel > 50 ? 'תתי-משימות מפורטים מאוד' : 'שלבים עיקריים בלבד'}&rlm;.
                       </p>
                    </div>
                 </div>

                 {/* Predictive Workload Mockup */}
                 <div className="bg-[#18181b]/40 border border-white/5 rounded-[48px] p-8 overflow-hidden relative">
                    <div className="flex flex-row-reverse items-center justify-between mb-8">
                       <h4 className="text-sm font-black text-white">עומס עבודה צפוי</h4>
                       <Activity size={18} className="text-emerald-400" />
                    </div>
                    <div className="h-32 flex items-end gap-1 px-2">
                       {[40, 70, 45, 90, 65, 30, 55, 80, 50, 40, 60, 95].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
                            <motion.div 
                               initial={{ height: 0 }} 
                               animate={{ height: `${h}%` }} 
                               className={`w-full bottom-0 rounded-t-lg transition-colors ${h > 80 ? 'bg-red-500/40' : 'bg-emerald-500/40'}`} 
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                               {h}% עומס
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="flex flex-row-reverse justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                       <span>סוף שבוע</span>
                       <span>היום</span>
                    </div>
                 </div>
              </div>

              {/* Toggles */}
              <div className="bg-[#18181b]/60 border border-white/5 rounded-[48px] p-8 space-y-4">
                 <div className="flex flex-row-reverse items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                    <div className="flex flex-row-reverse items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                          <Zap size={20} className="text-indigo-400" />
                       </div>
                       <div className="text-right">
                          <h4 className="text-sm font-black text-white">מצב &quot;טייס אוטומטי&quot;</h4>
                          <p className="text-[10px] text-slate-500 font-bold">אפשר לסוכן לסדר תגיות ועדיפויות לבד&rlm;.</p>
                    </div>
                    </div>
                    <button 
                      onClick={() => setAutoMode(!autoMode)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${autoMode ? 'bg-indigo-600' : 'bg-slate-800'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoMode ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="flex flex-row-reverse items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all opacity-50">
                    <div className="flex flex-row-reverse items-center gap-4">
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                          <Mic size={20} className="text-emerald-400" />
                       </div>
                       <div className="text-right">
                          <h4 className="text-sm font-black text-white">פרוקסימטי קולי</h4>
                          <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter mr-2">Soon</span>
                          <p className="text-[10px] text-slate-500 font-bold">זיהוי מחוות קוליות ללא לחיצה&rlm;.</p>
                       </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-800 rounded-full relative">
                       <div className="absolute top-1 left-1 w-4 h-4 bg-slate-600 rounded-full" />
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </main>
  );
}
