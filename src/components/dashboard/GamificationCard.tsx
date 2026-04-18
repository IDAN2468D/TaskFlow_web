"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Star } from 'lucide-react';

interface IGamificationCardProps {
  level: number;
  xp: number;
  streak: number;
  totalTasks: number;
}

export const GamificationCard: React.FC<IGamificationCardProps> = ({ 
  level, 
  xp, 
  streak, 
  totalTasks 
}) => {
  // Simple calculation for next level XP (example: Level * 1000)
  const nextLevelXp = (level || 1) * 1000;
  const progressPercent = Math.min(((xp || 0) / nextLevelXp) * 100, 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-surface-low backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[80px] -mr-20 -mt-20" />

      <div className="flex flex-row items-center justify-between mb-8 md:mb-12 relative z-10">
        <div className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[18px] md:rounded-[24px] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50">
            <Trophy className="text-white w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-right">
            <p className="text-indigo-400 text-[9px] md:text-xs font-black uppercase tracking-[0.2em]">דרגה נוכחית</p>
            <h3 className="text-white text-xl md:text-3xl font-black tracking-tight">שלב {level || 1}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 md:px-5 py-2 md:py-3 rounded-full border border-amber-500/20 backdrop-blur-md">
          <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-amber-500 font-black text-[10px] md:text-sm tracking-tight">{streak || 0} ימי רצף</span>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 relative z-10">
        <div className="flex flex-row justify-between items-end">
          <p className="text-white/40 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] leading-none">התקדמות לשלב הבא</p>
          <p className="text-white font-black text-base md:text-2xl leading-none tracking-tighter">{xp || 0} / {nextLevelXp} <span className="text-white/30 text-xs">XP</span></p>
        </div>
        
        <div className="h-3 md:h-5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5 outline outline-1 outline-white/10 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 2, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] relative" 
          >
            {/* Glossy overlay on bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 border-t border-white/5">
          <div className="text-center p-4 md:p-6 bg-white/[0.03] rounded-[24px] md:rounded-[32px] border border-white/5 group/stat hover:bg-white/[0.05] transition-colors">
             <div className="flex justify-center mb-2"><Target size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" /></div>
             <p className="text-white font-black text-lg md:text-2xl leading-none tracking-tighter">{totalTasks || 0}</p>
             <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-3">בוצעו</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-white/[0.03] rounded-[24px] md:rounded-[32px] border border-white/5 group/stat hover:bg-white/[0.05] transition-colors">
             <div className="flex justify-center mb-2"><Star size={16} className="text-slate-500 group-hover:text-amber-400 transition-colors" /></div>
             <p className="text-white font-black text-lg md:text-2xl leading-none tracking-tighter">Top 10%</p>
             <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-3">דירוג</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
