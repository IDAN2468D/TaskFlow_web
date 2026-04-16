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
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="relative group w-full"
    >
      {/* Premium Animated Border */}
      <div className="absolute -inset-[2px] rounded-[48px] overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#4f46e5,#6366f1)]"
        />
      </div>

      <div className="relative bg-[#0f172a] rounded-[46px] overflow-hidden p-[1px]">
        <div className="relative bg-slate-950/40 backdrop-blur-3xl rounded-[45px] p-8 md:p-12 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-between gap-12">
            
            <div className="flex-1 space-y-8 w-full">
              <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                <div className="flex flex-row-reverse items-center gap-2 group/label">
                  <Zap size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-xs font-black uppercase tracking-[0.2em]">דופק יומי • אוליבר AI</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  שלום, {userName.split(' ')[0]}!
                </h2>
              </div>

              {/* Critical Task Spotlight */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group/task"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/task:opacity-100 transition-opacity" />
                <div className="flex flex-row-reverse items-center gap-4 mb-4">
                  <TrendingUp className="text-indigo-400 w-5 h-5" />
                  <span className="text-indigo-300/80 text-sm font-black uppercase tracking-widest">המשימה הקריטית להיום</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-white text-right leading-relaxed">
                  {topTask || "ממתין למשימות חדשות..."}
                </p>
              </motion.div>

              <div className="flex flex-row-reverse items-center justify-between gap-4">
                <div className="flex flex-row-reverse items-center gap-3">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-rose-500/90 text-white px-6 py-3 rounded-full flex flex-row-reverse items-center gap-2 shadow-xl shadow-rose-500/20"
                  >
                    <AlertTriangle size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{urgentCount} דחופות</span>
                  </motion.div>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    AI ACTIVE
                  </div>
                </div>

                <motion.button 
                  whileHover={{ x: -10 }}
                  className="hidden md:flex items-center gap-3 text-white/40 hover:text-white transition-colors group/btn"
                >
                  <span className="text-sm font-black uppercase tracking-widest">לכל התובנות</span>
                  <ArrowLeft className="group-hover/btn:-translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>

            {/* AI Avatar / Brain Illustration */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 w-40 h-40 md:w-56 md:h-56 rounded-[48px] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                <BrainCircuit size={80} className="text-white md:w-28 md:h-28" />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-8 right-8"
                >
                  <Sparkles size={24} className="text-indigo-400" />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};
