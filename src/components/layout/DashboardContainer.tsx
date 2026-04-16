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
      className="flex-1 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden min-h-screen bg-[#020617]"
    >
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Unified Premium Header */}
        <motion.header variants={item} className="flex flex-row-reverse justify-between items-center mb-16 px-4">
          <div className="flex flex-col items-end gap-2 text-right">
             <div className="flex flex-row-reverse items-center gap-4">
                <p className="text-sm md:text-base text-indigo-400 font-black uppercase tracking-[3px]">
                   {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                TaskFlow <span className="text-indigo-500">AI</span>
             </h1>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden"
          >
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-xl object-cover" />
            ) : (
              <div className="w-full h-full rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                {userData?.name?.charAt(0) || 'U'}
              </div>
            )}
          </motion.div>
        </motion.header>

        {/* INTELLIGENCE HUB (DAILY PULSE & GAMIFICATION) */}
        <motion.section variants={item}>
          <IntelligenceHub 
            userData={userData}
            userProgress={userProgress}
            topTask={topTask}
            urgentCount={urgentCount} 
          />
        </motion.section>

        {/* Quick Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-4">
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] text-center backdrop-blur-md">
              <p className="text-3xl font-black text-white">{activeCount}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">פעילות</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] text-center backdrop-blur-md">
              <p className="text-3xl font-black text-white">{doneCount}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">הושלמו</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] text-center backdrop-blur-md">
              <p className="text-3xl font-black text-white">{userProgress?.currentStreak || 0}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">רצף (ימים)</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] text-center backdrop-blur-md">
              <p className="text-3xl font-black text-white">{userProgress?.level || 1}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">רמה</p>
            </div>
        </motion.div>

        {/* Main Content Sections with Children */}
        <div className="space-y-12">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
