"use client";

import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsClientProps {
  totalMinutesSaved: number;
  activeCount: number;
  doneCount: number;
  productivityScore: number;
  weeklyData: number[];
  recommendations: { text: string; type: 'tip' | 'info' | 'success' }[];
}

export default function AnalyticsClient({
  totalMinutesSaved,
  activeCount,
  doneCount,
  productivityScore,
  weeklyData,
  recommendations
}: AnalyticsClientProps) {
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  } as const;

  return (
    <motion.main 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#020617] text-slate-50 p-6 md:p-12 overflow-x-hidden relative selection:bg-indigo-500/30"
    >
      {/* Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] noise-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row-reverse items-start justify-between mb-20 gap-8">
           <div className="text-right">
             <motion.div variants={item} className="flex flex-row-reverse items-center gap-3 mb-4">
                <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2 backdrop-blur-md">
                   <Activity size={12} className="text-indigo-400" />
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Performance Intelligence</span>
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
             </motion.div>
             <motion.h1 variants={item} className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">
               אנליטיקה וביצועים
             </motion.h1>
             <motion.p variants={item} className="text-slate-400 font-medium text-xl max-w-2xl ml-auto leading-relaxed">
               ניתוח עמוק של הפרודוקטיביות שלך המונע ע&quot;י אלגוריתמים של Intelligence OS&rlm;.
             </motion.p>
           </div>
           
           <motion.div variants={item} className="flex gap-4">
              <div className="glass-premium border-obsidian rounded-3xl p-6 flex flex-col items-center justify-center min-w-[140px] shadow-2xl">
                 <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Global Rank</p>
                 <p className="text-3xl font-black text-white tracking-tighter">#124</p>
                 <div className="flex items-center gap-1 mt-2 text-emerald-400 text-[10px] font-bold">
                    <ArrowUpRight size={10} />
                    <span>Top 2%</span>
                 </div>
              </div>
           </motion.div>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
          {[
            { icon: Zap, label: "זמן שנחסך ע\"י AI", value: `${totalMinutesSaved} דק'`, color: "indigo", trend: "+12%" },
            { icon: Target, label: "משימות פעילות", value: activeCount, color: "blue", trend: "-5%" },
            { icon: CheckCircle2, label: "יעדי הצלחה", value: doneCount, color: "emerald", trend: "+28%" },
            { icon: TrendingUp, label: "ציון פרודוקטיביות", value: `${productivityScore}%`, color: "purple", trend: "+3%" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-premium border-obsidian p-6 md:p-8 rounded-[32px] md:rounded-[40px] flex flex-col gap-4 md:gap-6 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <stat.icon size={80} />
              </div>
              <div className={`w-14 h-14 bg-${stat.color}-500/10 rounded-2xl flex items-center justify-center border border-${stat.color}-500/20 shadow-xl`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
              </div>
              <div>
                <div className="flex flex-row-reverse justify-between items-center mb-1">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px]">{stat.label}</p>
                   <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.trend}
                   </span>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Productivity Chart */}
          <motion.div 
            variants={item}
            className="lg:col-span-8 glass-premium border-obsidian rounded-[40px] md:rounded-[56px] p-6 md:p-10 shadow-2xl flex flex-col min-h-[400px] md:min-h-[500px] relative overflow-hidden group"
          >
            <div className="flex flex-row-reverse items-center justify-between mb-12 relative z-10">
              <div className="flex flex-row-reverse items-center gap-5">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                   <BarChart3 className="text-indigo-400" size={32} />
                </div>
                <div className="text-right">
                   <h3 className="text-2xl font-black text-white tracking-tight">מגמת ביצוע שבועי</h3>
                   <p className="text-sm text-slate-500 font-medium tracking-tight">סיכום התפוקה לפי ימי השבוע&rlm;</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer">
                   Weekly
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-end gap-2 md:gap-4 px-2 md:px-6 mb-8 relative z-10">
              {weeklyData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="w-full relative h-[300px] flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                      className={`w-full bg-gradient-to-t ${h > 80 ? 'from-indigo-600/40 to-indigo-400' : 'from-indigo-900/40 to-indigo-600/60'} rounded-2xl relative transition-all duration-500 group-hover/bar:shadow-[0_0_30px_rgba(99,102,241,0.3)]`}
                    >
                      {h > 90 && (
                        <div className="absolute -top-1 left-0 right-0 h-1.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full animate-pulse" />
                      )}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black text-white bg-indigo-600 px-2 py-1 rounded-md">
                         {h}%
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-tighter group-hover/bar:text-indigo-400 transition-colors">
                    {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'][i]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-0 right-0 p-10 opacity-5 pointer-events-none">
               <Sparkles size={200} className="text-indigo-500" />
            </div>
          </motion.div>

          {/* AI Recommendations & Achievements */}
          <motion.div variants={item} className="lg:col-span-4 space-y-8 md:space-y-10">
            <div className="glass-premium border-obsidian rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
               <div className="flex flex-row-reverse items-center gap-4 mb-8 md:mb-10">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <Brain className="text-amber-400 w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <h3 className="text-lg md:text-xl font-black text-white text-right">המלצות בינה מלאכותית</h3>
               </div>
               
               <div className="space-y-4 md:space-y-6">
                 {recommendations.map((rec, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: -5 }}
                     className="bg-white/[0.03] p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-white/5 flex flex-row-reverse gap-3 md:gap-4 items-start group/rec"
                   >
                     <div className={`mt-1.5 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] flex-shrink-0 ${rec.type === 'tip' ? 'bg-amber-500 shadow-amber-500/50' : rec.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-indigo-500 shadow-indigo-500/50'}`} />
                     <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed text-right group-hover/rec:text-slate-200 transition-colors">{rec.text}</p>
                   </motion.div>
                 ))}
               </div>
            </div>

            <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
               <div className="flex flex-row-reverse items-center gap-4 mb-6">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10">
                    <Award className="text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <h4 className="text-white font-black text-base md:text-lg text-right">הישג השבוע</h4>
               </div>
               <p className="text-xs md:text-sm text-slate-400 font-medium text-right leading-relaxed mb-6">
                  השלמת 15 משימות ברצף ללא איחור! השגת את התג &quot;Master of Focus&quot;&rlm;.
               </p>
               <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" 
                  />
               </div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-4 text-right">85% Progress to Level 12</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
