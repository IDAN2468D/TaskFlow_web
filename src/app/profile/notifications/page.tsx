"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Clock, 
  Moon, 
  Sun,
  MessageSquareText,
  AlertTriangle,
  MailCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NOTIF_GROUPS = [
  {
    id: 'ai',
    title: 'בינה מלאכותית ותובנות',
    icon: Sparkles,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    items: [
      { id: 'briefing', name: 'תדריך בוקר יומי (Daily Strategy)', desc: 'קבל ניתוח אסטרטגי של היום שלך בכל בוקר ב-08:00' },
      { id: 'predictive', name: 'התראות חיזוי עומס', desc: 'כשה-AI מזהה עומס פוטנציאלי בשבוע הקרוב' }
    ]
  },
  {
    id: 'tasks',
    title: 'ניהול משימות ולו״ז',
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    items: [
      { id: 'deadline', name: 'תזכורות דד-ליין', desc: 'התראה 30 דקות לפני סיום משימה קריטית' },
      { id: 'overdue', name: 'סיכום משימות בעיכוב', desc: 'דו״ח יומי על משימות שעברו את הזמן המיועד' }
    ]
  }
];

export default function NotificationsUpgradePage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    briefing: true,
    predictive: true,
    deadline: true
  });

  const [quietMode, setQuietMode] = useState(false);

  const toggle = (id: string) => {
    setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-indigo-600/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-widest">Alert Engine v2.1</span>
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">התראות ותקשורת AI</h1>
             <p className="text-slate-400 font-medium text-lg">הגדר כיצד המערכת תתקשר איתך ותעדכן אותך&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Sidebar: Quiet Mode Control */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
              <button 
                onClick={() => setQuietMode(!quietMode)}
                className={`w-full p-8 rounded-[40px] border transition-all text-right relative overflow-hidden group ${quietMode ? 'bg-indigo-600/20 border-indigo-500/30 shadow-2xl shadow-indigo-500/10' : 'bg-[#18181b]/40 border-white/5 hover:bg-white/5'}`}
              >
                 <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all ${quietMode ? 'bg-indigo-500 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10'}`}>
                       {quietMode ? <Moon className="text-white" /> : <Sun className="text-slate-400" />}
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">מצב שקט (Quiet)</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">השהה את כל ההתראות פרט למשימות קריטיות (High Priority)&rlm;.</p>
                    
                    <div className="mt-8 flex flex-row-reverse items-center justify-between">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${quietMode ? 'text-indigo-400' : 'text-slate-600'}`}>Status: {quietMode ? 'Muted' : 'Normal'}</span>
                       <div className={`w-12 h-6 rounded-full relative transition-colors ${quietMode ? 'bg-indigo-500' : 'bg-white/10'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${quietMode ? 'left-1' : 'left-7'}`} />
                       </div>
                    </div>
                 </div>
              </button>

              <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 rounded-[40px] p-8">
                 <h4 className="text-white font-black text-sm mb-4 text-right uppercase tracking-wider">ערוצי תקשורת</h4>
                 <div className="space-y-4">
                    {[
                      { icon: MessageSquareText, name: 'Push Notifications' },
                      { icon: MailCheck, name: 'AI Email Reports' },
                      { icon: AlertTriangle, name: 'Emergency Alerts' }
                    ].map((channel, i) => (
                      <div key={i} className="flex flex-row-reverse items-center justify-between group">
                         <div className="flex flex-row-reverse items-center gap-3">
                            <channel.icon size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xs text-slate-400 font-bold">{channel.name}</span>
                         </div>
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                    ))}
                 </div>
              </div>
           </motion.div>

           {/* Main: Notification Groups */}
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
              {NOTIF_GROUPS.map((group, gIdx) => (
                <section key={group.id} className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                   <div className="flex flex-row-reverse items-center gap-4 mb-10">
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border shadow-inner ${group.bgColor} border-white/5`}>
                         <group.icon className={group.color} size={28} />
                      </div>
                      <h2 className="text-2xl font-black text-white">{group.title}</h2>
                   </div>

                   <div className="space-y-6">
                      {group.items.map((item, i) => (
                        <div 
                          key={item.id} 
                          className="flex flex-row-reverse items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                        >
                           <div className="text-right flex-1 ml-6">
                              <h3 className="font-black text-white mb-1 group-hover:text-amber-300 transition-colors">{item.name}</h3>
                              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                           </div>
                           <button 
                             onClick={() => toggle(item.id)}
                             className={`w-16 h-8 rounded-full relative transition-all shadow-inner ${enabled[item.id] ? 'bg-indigo-600' : 'bg-white/10'}`}
                           >
                              <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-lg ${enabled[item.id] ? 'left-2' : 'left-9'}`} />
                           </button>
                        </div>
                      ))}
                   </div>

                   {group.id === 'ai' && (
                     <div className="mt-10 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex flex-row-reverse items-center gap-6">
                        <Clock className="text-indigo-400 shrink-0" size={32} />
                        <div className="text-right">
                           <p className="text-sm font-black text-white">שעת התחלת יום מומלצת</p>
                           <p className="text-xs text-slate-400 font-medium">המערכת זיהתה שאתה הכי פרודוקטיבי לאחר 08:30&rlm;.</p>
                        </div>
                     </div>
                   )}
                </section>
              ))}
           </motion.div>
        </div>
      </div>
    </main>
  );
}
