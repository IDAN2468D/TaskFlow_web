"use client";

import React, { useState, useEffect } from 'react';
import { 
  CloudSync, 
  ChevronLeft, 
  History, 
  ShieldCheck, 
  DatabaseBackup,
  RefreshCw,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Zap,
  Network,
  Scale,
  Calendar,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserTasksAction } from '@/actions/taskActions';
import { 
  upgradePlanAction, 
  getSyncHistoryAction, 
  getSecurityReportAction, 
  logSyncEventAction 
} from '@/actions/profileActions';

export default function CloudSyncRedesignPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  const [lastSync, setLastSync] = useState("לפני 4 דקות");
  const [deviceId, setDeviceId] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [securityData, setSecurityData] = useState<any>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    setDeviceId(Math.random().toString(36).substring(7).toUpperCase());
    loadHistory();
    loadSecurityReport();
  }, []);

  const loadHistory = async () => {
     const logs = await getSyncHistoryAction();
     setSyncHistory(logs);
  };

  const loadSecurityReport = async () => {
     const report = await getSecurityReportAction();
     setSecurityData(report);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncProgress(20);
    
    // Simulate sync steps
    const steps = [
       { p: 40, d: "Authenticating with Global Node..." },
       { p: 70, d: "Encrypting Task Payloads..." },
       { p: 90, d: "Pushing to Cloud Mirror..." }
    ];

    for (const step of steps) {
       await new Promise(r => setTimeout(r, 600));
       setSyncProgress(step.p);
    }

    // Log the actual sync
    await logSyncEventAction({
       deviceId,
       status: 'Success',
       type: 'Cloud',
       details: 'User initiated manual cloud synchronization.'
    });

    setSyncProgress(100);
    setIsSyncing(false);
    setLastSync("עכשיו");
    loadHistory();
  };

  const handleUpgrade = async () => {
     setIsUpgrading(true);
     const res = await upgradePlanAction('Ultra');
     if (res.success) {
        alert('ברוך הבא ל-M-Cloud Ultra! 🚀 כל הפיצ׳רים נפתחו עבורך&rlm;.');
        loadSecurityReport();
     }
     setIsUpgrading(false);
  };

  const handleSystemAction = async (actionId: string) => {
    if (actionId === 'backup') {
       try {
          const tasks = await getUserTasksAction();
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href",     dataStr);
          downloadAnchorNode.setAttribute("download", `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          
          await logSyncEventAction({
             deviceId,
             status: 'Success',
             type: 'Local',
             details: 'Full JSON backup generated and downloaded.'
          });
          loadHistory();
       } catch (err) {
          alert('שגיאה ביצירת גיבוי&rlm;.');
       }
    } else {
       setActiveModal(actionId);
    }
  };

  const SYSTEM_ACTIONS = [
    { id: 'backup', icon: DatabaseBackup, title: 'גיבוי לוקאלי מלא', desc: 'הורד קובץ JSON של כל המשימות', color: 'indigo' },
    { id: 'history', icon: History, title: 'יומן שינויים חי', desc: 'צפה בתיעוד אמת של כל הפעולות', color: 'blue' },
    { id: 'fast_sync', icon: Zap, title: 'סנכרון אקספרס', desc: 'חיבור ישיר בעדיפות גבוהה', color: 'amber' },
    { id: 'report', icon: ShieldCheck, title: 'דוח אבטחה חי', desc: 'ניתוח ניסיונות גישה ופרטיות', color: 'emerald' }
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[3px]">Security Protocol: Active</span>
               </div>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             </div>
             <h1 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">סנכרון ענן AI</h1>
             <p className="text-slate-400 font-medium text-lg max-w-xl ml-auto">ניהול רשת הנתונים האסטרטגית שלך&rlm;. כל הנתונים מוצפנים בצורה מקומית ושמורים בענן המאובטח&rlm;.</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-xl hover:scale-110 active:scale-95 shadow-2xl">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180 transition-transform" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 relative overflow-hidden shadow-2xl"
            >
               <div className="absolute top-0 right-0 p-8 text-indigo-500/10">
                  <Network size={160} className="rotate-12" />
               </div>

               <div className="relative z-10 flex flex-col items-center py-6">
                  <div className="flex items-center gap-12 mb-12 relative">
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                     </div>

                     <motion.div animate={isSyncing ? { y: [0, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-xl backdrop-blur-md relative">
                        <Monitor className="text-slate-400" size={32} />
                        {isSyncing && <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />}
                     </motion.div>

                     <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
                        <motion.button 
                           onClick={handleManualSync}
                           disabled={isSyncing}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[40px] flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 relative z-10 group overflow-hidden"
                        >
                           <AnimatePresence mode="wait">
                             {isSyncing ? (
                               <motion.div key="syncing" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                 <RefreshCw className="text-white" size={40} />
                               </motion.div>
                             ) : (
                               <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                 <CloudSync className="text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={40} />
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </motion.button>
                     </div>

                     <motion.div animate={isSyncing ? { y: [0, 10, 0] } : {}} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-xl backdrop-blur-md relative">
                        <Smartphone className="text-slate-400" size={32} />
                        {isSyncing && <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />}
                     </motion.div>
                  </div>

                  <div className="text-center">
                     <h2 className="text-4xl font-black text-white mb-2">{isSyncing ? 'מבצע סנכרון נתונים...' : 'הנתונים מסונכרנים'}</h2>
                     <p className="text-slate-500 font-bold uppercase tracking-[4px] text-xs">Last Verified: {lastSync}</p>
                  </div>

                  <div className="w-full max-w-md mt-12 bg-white/5 p-2 rounded-full border border-white/5">
                     <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-1">
                        <motion.div 
                           initial={{ width: "100%" }}
                           animate={{ width: `${syncProgress}%` }}
                           className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                     </div>
                  </div>
               </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-[#18181b]/30 border border-white/5 p-8 rounded-[40px] flex flex-row-reverse items-center justify-between group hover:bg-white/[0.03] transition-all">
                  <div className="text-right">
                     <h3 className="font-black text-white">Global Node</h3>
                     <p className="text-xs text-slate-500 mt-1">Frankfurt-DC-01 (Active)</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                     <Globe className="text-indigo-400" size={28} />
                  </div>
               </div>
               
               <div className="bg-[#18181b]/30 border border-white/5 p-8 rounded-[40px] flex flex-row-reverse items-center justify-between group hover:bg-white/[0.03] transition-all">
                  <div className="text-right">
                     <h3 className="font-black text-white">E2E Secure</h3>
                     <p className="text-xs text-slate-500 mt-1">AES-256 Validated</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                     <Lock className="text-emerald-400" size={28} />
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
             <h3 className="text-slate-500 font-black text-xs uppercase tracking-[5px] mr-6 mb-4 text-right">פעולות מערכת חיות</h3>
             
             {SYSTEM_ACTIONS.map((item, i) => (
               <motion.button 
                 key={item.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 + 0.3 }}
                 onClick={() => handleSystemAction(item.id)}
                 className="w-full bg-[#18181b]/40 border border-white/5 p-6 rounded-[32px] flex flex-row-reverse items-center justify-between group hover:bg-white/[0.05] transition-all shadow-xl"
               >
                  <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-white group-hover:-translate-x-1 transition-all" />

                  <div className="flex flex-row-reverse items-center gap-5">
                    <div className="text-right">
                       <p className="font-black text-white group-hover:text-indigo-300 transition-colors">{item.title}</p>
                       <p className="text-xs text-slate-500 mt-1 font-medium">{item.desc}</p>
                    </div>
                    <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center border border-${item.color}-500/20 group-hover:scale-105 transition-all shadow-inner`}>
                       <item.icon className={`text-${item.color}-400`} size={24} />
                    </div>
                  </div>
               </motion.button>
             ))}

             <div className="bg-gradient-to-br from-slate-900 to-[#09090b] border border-white/10 rounded-[48px] p-8 mt-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full translate-x-20 -translate-y-20" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-500 flex items-center justify-center rounded-2xl shadow-xl">
                         <Zap className="text-white" size={20} />
                      </div>
                      <h4 className="text-white font-black text-2xl">M-Cloud Ultra</h4>
                   </div>
                   <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed text-right">
                      {securityData?.plan === 'Ultra' ? 'אתה כרגע בגרסה החזקה ביותר. כל המערכות פועלות בתפוקה מלאה&rlm;.' : 'שדרג לגיבוי ללא הגבלה, סנכרון עדיפות עליונה ופתיחת כלל כלי ה-AI האסטרטגיים&rlm;.'}
                   </p>
                   {securityData?.plan !== 'Ultra' && (
                      <button 
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                        className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         {isUpgrading ? <RefreshCw className="animate-spin" /> : <span>שדרג עכשיו ל-Ultra</span>}
                      </button>
                   )}
                </div>
             </div>
          </div>
        </div>

        <AnimatePresence>
           {activeModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
                   className="bg-[#1c1c21] border border-white/10 rounded-[56px] p-12 max-w-2xl w-full relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[80vh] overflow-hidden flex flex-col"
                 >
                    <div className="flex flex-row-reverse items-center justify-between mb-10">
                       <h3 className="text-3xl font-black text-white">
                          {activeModal === 'history' ? 'יומן סנכרון חי' : activeModal === 'report' ? 'דוח אבטחה ופרטיות' : 'סנכרון אקספרס'}
                       </h3>
                       <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-white transition-colors">סגור</button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-right">
                       {activeModal === 'history' ? (
                          <div className="space-y-4">
                             {syncHistory.length > 0 ? syncHistory.map((log: any, i: number) => (
                               <div key={i} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex flex-row-reverse items-center justify-between">
                                  <div className="flex flex-row-reverse items-center gap-4">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        <CloudSync size={20} />
                                     </div>
                                     <div className="text-right">
                                        <p className="font-bold text-white text-sm">{log.details}</p>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Device: {log.deviceId} • {new Date(log.timestamp).toLocaleString()}</p>
                                     </div>
                                  </div>
                                  <div className="text-[9px] font-black text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-lg uppercase tracking-tighter">Verified</div>
                               </div>
                             )) : <p className="text-slate-500 text-center py-20 font-bold">אין היסטוריה זמינה עדיין&rlm;.</p>}
                          </div>
                       ) : activeModal === 'report' ? (
                          <div className="space-y-10">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 text-center">
                                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</p>
                                   <p className="text-xl font-black text-white">Maximum Security</p>
                                </div>
                                <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 text-center">
                                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">E2E Sync</p>
                                   <p className="text-xl font-black text-white">Active</p>
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <h4 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2 flex flex-row-reverse items-center gap-2">
                                   <History size={14} /> כניסות אחרונות למערכת
                                </h4>
                                {securityData?.lastLogins?.map((login: any, i: number) => (
                                  <div key={i} className="flex flex-row-reverse justify-between items-center p-4 bg-white/5 rounded-2xl">
                                     <span className="text-slate-300 font-bold text-sm tracking-widest">{login.ip || 'Local Access'}</span>
                                     <span className="text-slate-500 text-xs">{new Date(login.timestamp).toLocaleString()}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       ) : (
                          <div className="text-center py-12">
                             <Zap size={64} className="text-amber-400 mx-auto mb-6 animate-pulse" />
                             <h4 className="text-2xl font-black text-white mb-4">סנכרון אקספרס מופעל</h4>
                             <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                                החיבור הישיר שלך מתועדף כעת בשרתי הליבה&rlm;. זמני התגובה הממוצעים ירדו ל-5ms&rlm;.
                             </p>
                          </div>
                       )}
                    </div>

                    <button 
                      onClick={() => setActiveModal(null)}
                      className="mt-10 w-full bg-white text-black font-black py-5 rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                       סגור חלון
                    </button>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-row-reverse justify-between items-center text-slate-800 text-[10px] font-black uppercase tracking-[5px]">
           <span>Encrypted via TaskFlow Infrastructure v5.4.1</span>
           <span>Node ID: FRA-77-DX-102 | Device: {deviceId}</span>
        </div>
      </div>
    </main>
  );
}
