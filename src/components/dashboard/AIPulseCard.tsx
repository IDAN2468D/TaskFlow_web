"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, TrendingUp, AlertTriangle, Zap, BrainCircuit } from 'lucide-react';

interface IAIPulseCardProps {
  userName: string;
  topTask: string;
  urgentCount: number;
}

export const AIPulseCard: React.FC<IAIPulseCardProps> = ({ userName, topTask, urgentCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="relative group w-full h-full"
    >
      {/* Animated Glowing Edge */}
      <div className="absolute -inset-[1px] rounded-[32px] md:rounded-[48px] overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_45deg,#6366f1_90deg,transparent_135deg)] opacity-30"
        />
      </div>

      <div className="relative glass-premium border-obsidian rounded-[32px] md:rounded-[48px] overflow-hidden h-full flex flex-col">
        {/* Scanning Light Sweep */}
        <motion.div 
          animate={{ 
            x: ["-100%", "250%"],
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
          className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent skew-x-12 z-[1] pointer-events-none"
        />

        <div className="relative p-6 md:p-12 z-[2] flex-1 flex flex-col justify-center">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-[120px] -ml-40 -mb-40" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
            
            <div className="flex-1 space-y-6 md:space-y-10 w-full">
              <div className="flex flex-col items-center md:items-start gap-2 md:gap-4 text-center md:text-right">
                <div className="flex flex-row items-center gap-2 group/label">
                  <Zap size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-[9px] md:text-xs font-black uppercase tracking-[0.3em]">AI Daily Pulse • Oliver Intelligence</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  שלום, {userName.split(' ')[0]}!
                </h2>
              </div>

              {/* Critical Task Spotlight */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden group/task"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/task:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-row items-center gap-4 mb-4">
                  <TrendingUp className="text-indigo-400 w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-indigo-300/80 text-[10px] md:text-xs font-black uppercase tracking-widest">מיקוד נוכחי</span>
                </div>
                <p className="text-lg md:text-2xl font-black text-white text-right leading-relaxed tracking-tight">
                  {topTask || "מנתח סדר עדיפויות..."}
                </p>
              </motion.div>

              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2 md:gap-4">
                  <motion.div 
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="bg-rose-500/90 text-white px-4 md:px-8 py-2 md:py-4 rounded-full flex flex-row items-center gap-2 shadow-xl shadow-rose-500/20"
                  >
                    <AlertTriangle size={14} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{urgentCount} דחופות</span>
                  </motion.div>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 md:px-8 py-2 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    Neural Active
                  </div>
                </div>

                <motion.button 
                  whileHover={{ x: 10 }}
                  className="hidden md:flex items-center gap-3 text-white/40 hover:text-white transition-all group/btn"
                >
                  <ArrowLeft className="group-hover/btn:translate-x-2 transition-transform duration-300 rotate-180" />
                  <span className="text-sm font-black uppercase tracking-widest">לכל התובנות</span>
                </motion.button>
              </div>
            </div>

            {/* AI Avatar / Brain Illustration - More Modern & Alive */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-40 h-40 md:w-80 md:h-80 flex items-center justify-center shrink-0"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 w-32 h-32 md:w-64 md:h-64 rounded-[32px] md:rounded-[48px] flex items-center justify-center shadow-2xl group-hover:border-white/20 transition-colors">
                <BrainCircuit className="text-white w-16 h-16 md:w-32 md:h-32 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-6 right-6 md:top-12 md:right-12"
                >
                  <Sparkles size={20} className="text-indigo-400" />
                </motion.div>
                
                {/* Orbiting particles */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none"
                >
                   <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full blur-[2px]" />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};
