"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import IntelligenceHub from "@/components/dashboard/IntelligenceHub";

interface IDashboardContainerProps {
  children: React.ReactNode;
  userData: any;
  userProgress?: any;
  activeCount: number;
  doneCount: number;
  urgentCount: number;
  topTask?: string;
}

export default function DashboardContainer({ 
  children, 
  userData, 
  userProgress,
  activeCount, 
  doneCount,
  urgentCount,
  topTask
}: IDashboardContainerProps) {
  
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 12 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden min-h-screen bg-obsidian"
    >
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, -60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-16">
        {/* Unified Premium Header */}
        <motion.header variants={item} className="flex flex-row justify-between items-center mb-12 md:mb-20 px-2">
          <div className="flex flex-col items-start gap-1 text-right">
             <div className="flex flex-row items-center gap-4 md:gap-6">
                <div className="flex flex-col items-start">
                  <p className="text-[10px] md:text-sm text-indigo-400 font-black uppercase tracking-[4px] md:tracking-[6px] mb-1 opacity-80">
                    Intelligence OS v2.0
                  </p>
                  <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    Dashboard
                  </h1>
                </div>
                <div className="w-1.5 h-12 md:h-20 bg-gradient-to-b from-indigo-500 to-transparent rounded-full ml-2 md:ml-4 opacity-40" />
             </div>
             
             <div className="flex flex-row items-center gap-3 mt-4">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
                  <span className="text-[9px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest">Core Active</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-bold tracking-tight uppercase">
                  {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
             </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-outer blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-outer bg-obsidian border border-white/10 flex items-center justify-center p-1 overflow-hidden shadow-2xl">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-inner bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-xl">
                  {userData?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </motion.div>
        </motion.header>

        {/* INTELLIGENCE HUB (DAILY PULSE & GAMIFICATION) */}
        <motion.section variants={item} className="mb-16 md:mb-24">
          <IntelligenceHub 
            userData={userData}
            userProgress={userProgress}
            topTask={topTask}
            urgentCount={urgentCount} 
          />
        </motion.section>

        {/* Quick Stats Grid - More Modern Design */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20 md:mb-28 px-2">
            {[
              { label: "פעילות", value: activeCount, color: "indigo" },
              { label: "הושלמו", value: doneCount, color: "emerald" },
              { label: "רצף (ימים)", value: userProgress?.currentStreak || 0, color: "amber" },
              { label: "רמה", value: userProgress?.level || 1, color: "purple" }
            ].map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-white/[0.02] rounded-[24px] md:rounded-[32px] blur-sm transition-all group-hover:bg-white/[0.05]" />
                <div className="relative bg-surface-low border border-white/5 p-6 md:p-10 rounded-[24px] md:rounded-[32px] text-center backdrop-blur-xl shadow-xl hover:border-white/10 transition-all">
                  <p className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
                  <div className="flex flex-col items-center">
                    <p className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[3px] group-hover:text-slate-300 transition-colors">{stat.label}</p>
                    <div className="w-6 h-0.5 bg-indigo-500/30 mt-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-indigo-500" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </motion.div>

        {/* Main Content Sections with Children */}
        <div className="space-y-16 md:space-y-24 pb-20">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
