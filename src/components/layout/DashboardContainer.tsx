"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { TrendingUp, BrainCircuit } from "lucide-react";

interface IDashboardContainerProps {
  children: React.ReactNode;
  userData: any;
  activeCount: number;
  doneCount: number;
}

export default function DashboardContainer({ 
  children, 
  userData, 
  activeCount, 
  doneCount 
}: IDashboardContainerProps) {
  
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden min-h-screen"
    >
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Redesigned Premium Header Section */}
        <motion.header variants={item} className="flex flex-col md:flex-row-reverse justify-between items-center md:items-start mb-20 gap-8">
          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <div className="flex flex-row-reverse items-center gap-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                שלום, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">{userData?.name ? userData.name.split(' ')[0] : 'אסטרטג'}</span>
              </h1>
              <span className="text-5xl animate-bounce duration-[3000ms]">👋</span>
            </div>
             <div className="flex flex-row-reverse items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
               <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
               <p className="text-sm md:text-base text-indigo-300 font-black uppercase tracking-[2px]">
                  {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
               </p>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group p-[3px] rounded-[40px] overflow-hidden shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative bg-[#09090b] p-1.5 rounded-[38px] border border-white/10 flex items-center justify-center overflow-hidden">
                {userData?.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <TrendingUp className="w-12 h-12 text-indigo-400" />
                   </div>
                )}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#09090b] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
             </div>
          </motion.div>
        </motion.header>

        {/* AI SPOTLIGHT SECTION */}
        <motion.section variants={item} className="relative mb-24 group">
          <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[50px]" />
          <div className="bg-[#18181b]/40 backdrop-blur-3xl rounded-[50px] p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
            
            <div className="flex-1 space-y-6 relative z-10 text-center lg:text-right">
              <div className="flex flex-row-reverse items-center justify-center lg:justify-start gap-4">
                <div className="px-5 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-[11px] font-black text-indigo-300 uppercase tracking-[0.25em] shadow-lg">AI Spotlight</div>
                <div className="h-[1px] w-12 bg-indigo-500/30" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                מוכן להפוך רעיונות <br/>
                <span className="text-indigo-500">למשימות ביצועיות?</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mr-0">
                תן ל-אוליבר לנתח את העסק שלך, לפרק פרויקטים מורכבים ולייצר לך לו״ז חכם בתוך שניות&rlm;.
              </p>
            </div>
            
            <motion.div 
               whileHover={{ y: -5 }}
               className="w-full lg:w-auto relative z-10"
            >
              <div className="bg-[#09090b]/60 p-10 rounded-[40px] border border-white/10 backdrop-blur-2xl w-full lg:w-96 shadow-2xl group/card">
                <div className="flex flex-row-reverse items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 group-hover/card:scale-110 transition-transform">
                    <BrainCircuit className="text-indigo-400 w-6 h-6" />
                  </div>
                  <span className="text-lg font-black text-slate-100 tracking-tight">סטטוס סוכן AI</span>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-row-reverse justify-between text-[12px] font-black text-indigo-300 uppercase tracking-widest">
                    <span>עומס מערכת</span>
                    <span>85%</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]" 
                    />
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 font-bold leading-relaxed mt-8 text-right border-t border-white/5 pt-6 italic">
                  "אוליבר מזהה {activeCount} משימות קריטיות וממליץ על אופטימיזציה של זמן הביצוע ב-24%."
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-[#18181b]/40 backdrop-blur-2xl rounded-[40px] p-10 border border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.02] transition-colors duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl" />
            <span className="text-7xl font-black text-white tracking-tighter relative z-10 transition-transform group-hover:scale-110 duration-500">
              {activeCount}
            </span>
            <span className="text-[14px] font-black text-slate-500 uppercase tracking-[0.3em] mt-6 relative z-10">משימות פעילות</span>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-indigo-600 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex flex-col items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 via-transparent to-transparent" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-3xl rounded-full" 
            />
            <span className="text-7xl font-black text-white tracking-tighter relative z-10 transition-transform group-hover:scale-110 duration-500">
              {doneCount}
            </span>
            <span className="text-[14px] font-black text-indigo-100 uppercase tracking-[0.3em] mt-6 relative z-10">הושלמו בהצלחה</span>
          </motion.div>
        </motion.div>

        {/* Main Content Sections with Children */}
        <div className="space-y-24">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
