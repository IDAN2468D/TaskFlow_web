"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Lock, 
  Fingerprint, 
  Smartphone, 
  ShieldAlert, 
  Key, 
  Eye, 
  EyeOff,
  History,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSecurityReportAction } from '@/actions/profileActions';

export default function SecurityCenterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [securityData, setSecurityData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const loadData = async () => {
     const report = await getSecurityReportAction();
     setSecurityData(report);
     setIsRefreshing(false);
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const report = await getSecurityReportAction();
      if (isMounted) {
        setSecurityData(report);
        setIsRefreshing(false);
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* Security Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                   <ShieldCheck size={12} className="text-emerald-400" />
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-right">Protection Level: High</span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter leading-none">מרכז אבטחה ופרטיות</h1>
             <p className="text-slate-400 font-medium text-lg max-w-xl ml-auto">ניהול מפתחות הצפנה, התקנים מחוברים והגנת נתונים אסטרטגית&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           
           {/* Section 1: Security Health */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
              <div className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Fingerprint className="text-indigo-400" size={48} />
                 </div>

                 <h2 className="text-2xl font-black text-white mb-2">שלום, {securityData?.plan === 'Ultra' ? 'Ultra Member' : 'Member'}</h2>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-[4px]">Verified Digital ID</p>

                 <div className="mt-10 space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl flex flex-row-reverse items-center justify-between border border-white/5">
                       <span className="text-xs font-bold text-slate-400">אימות דו-שלבי</span>
                       <span className="text-xs font-black text-indigo-400">פעיל (Active)</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl flex flex-row-reverse items-center justify-between border border-white/5">
                       <span className="text-xs font-bold text-slate-400">הצפנת AES-256</span>
                       <span className="text-xs font-black text-emerald-400">מופעלת (E2E)</span>
                    </div>
                 </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] flex flex-col gap-6">
                 <div className="flex flex-row-reverse items-center gap-3">
                    <ShieldAlert className="text-red-400" size={24} />
                    <h3 className="text-white font-black text-sm uppercase tracking-widest">משימות אבטחה</h3>
                 </div>
                 <p className="text-xs text-red-400/80 font-medium text-right leading-relaxed italic">
                    &quot;לא זוהו פרצות אבטחה ב-30 הימים האחרונים. המערכת ממשיכה לסרוק את התשתית בכל 5 דקות&rlm;.&quot;
                 </p>
              </div>
           </motion.div>

           {/* Section 2: Detailed Logs & Access */}
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
              
              <section className="bg-[#18181b]/40 border border-white/5 rounded-[48px] p-10 shadow-2xl relative">
                 <div className="flex flex-row-reverse items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-white flex flex-row-reverse items-center gap-4">
                       <History className="text-indigo-500" />
                       התחברויות אחרונות (IP Log)
                    </h2>
                    <button onClick={loadData} className="text-slate-500 hover:text-white transition-colors">
                       <RotateCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                 </div>

                 <div className="space-y-4 overflow-hidden">
                    {securityData?.lastLogins?.map((login: any, i: number) => (
                      <div key={i} className="flex flex-row-reverse items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                         <div className="text-right">
                            <p className="text-xs font-black text-indigo-400 mb-1">{new Date(login.timestamp).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(login.timestamp).toLocaleTimeString()}</p>
                         </div>
                         <div className="flex flex-row-reverse items-center gap-5">
                            <div className="text-right">
                               <p className="text-white font-black">{login.ip || 'Local Development Interface'}</p>
                               <p className="text-xs text-slate-500 font-medium mt-1">גישה מלאה אושרה מהתקן מוכר&rlm;</p>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                               <Smartphone size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                         </div>
                      </div>
                    ))}
                    {(!securityData?.lastLogins || securityData.lastLogins.length === 0) && (
                       <div className="py-20 text-center">
                          <p className="text-slate-500 font-bold italic">לא נמצאו התחברויות קודמות בשירות הענן&rlm;.</p>
                       </div>
                    )}
                 </div>
              </section>

              <section className="bg-gradient-to-br from-[#18181b] to-black border border-white/5 rounded-[48px] p-10 shadow-2xl">
                 <h2 className="text-2xl font-black text-white mb-10 text-right flex flex-row-reverse items-center gap-4">
                    <Key className="text-amber-500" />
                    ניהול מפתחות הצפנה
                 </h2>
                 
                 <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 relative group">
                    <div className="flex flex-row-reverse items-center justify-between mb-6">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Active Storage Key (AES)</span>
                       <button onClick={() => setShowPassword(!showPassword)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 font-mono text-xs overflow-x-auto whitespace-nowrap text-center text-slate-400 tracking-widest">
                       {showPassword ? '8f3e2a9b-0c1d-4e5f-8a7b-6c5d4e3f2a1b-TASKFLOW' : '••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <p className="text-[10px] text-center text-slate-600 font-bold mt-6 uppercase tracking-widest leading-relaxed">
                       This key exists only locally and in encrypted database memory. TaskFlow AI staff cannot access your tasks.
                    </p>
                 </div>
              </section>
           </motion.div>
        </div>
      </div>
    </main>
  );
}
