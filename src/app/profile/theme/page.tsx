"use client";

import React, { useState } from 'react';
import { 
  Palette, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Layers, 
  Sun, 
  Moon,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'obsidian', name: 'Obsidian & Indigo', desc: 'חוויית פרימיום כהה ומלוטשת', colors: ['#09090b', '#6366f1', '#18181b'], active: true },
  { id: 'emerald', name: 'Emerald Forest', desc: 'זרימת עבודה ירוקה ומרגיעה', colors: ['#064e3b', '#10b981', '#065f46'], active: false },
  { id: 'crimson', name: 'Crimson Data', desc: 'ביצועים אינטנסיביים באדום', colors: ['#450a0a', '#ef4444', '#7f1d1d'], active: false },
  { id: 'cyber', name: 'Cyberpunk Neon', desc: 'ניגודיות מקסימלית לעבודה מהירה', colors: ['#000000', '#f1c40f', '#1e1b4b'], active: false }
];

export default function ThemeUpgradePage() {
  const [selected, setSelected] = useState('obsidian');
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const currentTheme = THEMES.find(t => t.id === (previewing || selected)) || THEMES[0];
  const activeColor = currentTheme.colors[1];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert('העיצוב הוחל בהצלחה על כל מערכות TASKFLOW AI&rlm;!');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden transition-colors duration-700">
      {/* Dynamic Theme Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none transition-all duration-700">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10 blur-[150px] transition-all duration-700" 
          style={{ 
            background: `radial-gradient(circle at center, ${activeColor}, transparent)` 
          }} 
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${activeColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full flex items-center gap-2 border transition-all" style={{ backgroundColor: `${activeColor}10`, borderColor: `${activeColor}20` }}>
                   <Palette size={12} style={{ color: activeColor }} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-right" style={{ color: activeColor }}>Engine v4.0.5</span>
                </div>
                <div className="flex -space-x-1 flex-row-reverse">
                   {THEMES.map(t => (
                     <div key={t.id} className="w-4 h-4 rounded-full border border-black shadow-lg" style={{ backgroundColor: t.colors[1] }} />
                   ))}
                </div>
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter leading-none">התאמה אישית ויזואלית</h1>
             <p className="text-slate-400 font-medium text-lg">בחר את האסתטיקה המושלמת לניהול המשימות שלך&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* Section 1: Style Parameters */}
           <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
              <div className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-sm font-black text-slate-500 uppercase tracking-[4px] mb-8 text-right">פרמטרים של סוכן</h3>
                 
                 <div className="space-y-8">
                    {[
                      { icon: Layers, label: 'שקיפות גבוהה (Blur)', value: 85 },
                      { icon: Zap, label: 'מהירות אנימציות', value: 92 },
                      { icon: Eye, label: 'ניגודיות טקסט', value: 100 }
                    ].map((param, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex flex-row-reverse justify-between items-center text-xs font-black">
                            <span className="text-white flex flex-row-reverse items-center gap-2">
                               <param.icon size={14} style={{ color: activeColor }} />
                               {param.label}
                            </span>
                            <span style={{ color: activeColor }}>{param.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${param.value}%` }} 
                               className="h-full transition-colors duration-500" 
                               style={{ backgroundColor: activeColor, boxShadow: `0 0 10px ${activeColor}50` }}
                            />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="mt-12 flex flex-row-reverse items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: activeColor }}>
                       <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full translate-x-5" />
                    </div>
                    <div className="flex flex-row-reverse items-center gap-3">
                       <Sun size={18} className="text-amber-400" />
                       <span className="text-xs font-bold text-white">מעבר יום/לילה אוטו'</span>
                    </div>
                 </div>
              </div>

              <div className="rounded-[40px] p-8 shadow-2xl overflow-hidden relative group transition-all duration-700" style={{ background: `linear-gradient(135deg, ${activeColor}, ${currentTheme.colors[0]})` }}>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                 <Sparkles className="text-white/20 absolute -bottom-4 -right-4 w-32 h-32 rotate-12" />
                 <h4 className="text-white font-black text-xl mb-2 relative z-10 text-right">עיצוב AI אוטומטי</h4>
                 <p className="text-white/70 text-xs font-medium relative z-10 leading-relaxed text-right">אפשר למערכת להתאים את צבעי הממשק לפי רמת הלחץ בלו״ז שלך&rlm;.</p>
                 <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="mt-6 w-full py-3 bg-white text-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest relative z-10 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                 >
                   {isApplying ? <RefreshCw className="animate-spin" size={14} /> : 'הפעל AI Styling'}
                 </button>
              </div>
           </motion.div>

           {/* Section 2: Theme Cards */}
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {THEMES.map((theme, i) => (
                   <motion.button
                     key={theme.id}
                     whileHover={{ y: -8, scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setSelected(theme.id)}
                     onMouseEnter={() => setPreviewing(theme.id)}
                     onMouseLeave={() => setPreviewing(null)}
                     className="p-1 rounded-[48px] border-2 transition-all relative overflow-hidden h-full"
                     style={{ 
                       borderColor: selected === theme.id ? theme.colors[1] : 'rgba(255,255,255,0.05)',
                       boxShadow: selected === theme.id ? `0 0 30px ${theme.colors[1]}33` : 'none'
                     }}
                   >
                      <div className="bg-[#1c1c21] rounded-[44px] p-8 h-full flex flex-col items-end">
                         {/* Swatch Circle */}
                         <div className="w-24 h-24 rounded-full flex items-center justify-center p-2 mb-6 border border-white/10 shadow-inner relative overflow-hidden group self-center">
                             <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})` }} />
                             {selected === theme.id && (
                               <div className="relative z-10 bg-white text-black p-2 rounded-full shadow-2xl">
                                  <Check size={20} strokeWidth={4} />
                                </div>
                             )}
                         </div>

                         <h3 className="text-xl font-black text-white mb-2 text-right">{theme.name}</h3>
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 text-right w-full">{theme.desc}</p>
                         
                         {/* Mini UI Preview (RTL) */}
                         <div className="w-full h-24 bg-[#09090b] rounded-24 border border-white/5 p-3 flex flex-col gap-2 items-end overflow-hidden shadow-2xl">
                            <div className="h-4 w-2/3 rounded-full opacity-20" style={{ backgroundColor: theme.colors[1] }} />
                            <div className="h-3 w-1/2 rounded-full opacity-10" style={{ backgroundColor: theme.colors[1] }} />
                            <div className="mt-auto w-full flex flex-row-reverse justify-between">
                               <div className="h-4 w-4 rounded-full opacity-30" style={{ backgroundColor: theme.colors[1] }} />
                               <div className="h-4 w-12 rounded-full opacity-30" style={{ backgroundColor: theme.colors[1] }} />
                            </div>
                         </div>
                      </div>
                   </motion.button>
                 ))}
              </div>
           </motion.div>
        </div>
      </div>
    </main>
  );
}
