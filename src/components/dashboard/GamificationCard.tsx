"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Star, ChevronLeft } from 'lucide-react';

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
      className="bg-[#18181b]/30 backdrop-blur-3xl rounded-[40px] p-10 border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="flex flex-row-reverse items-center justify-between mb-10">
        <div className="flex flex-row-reverse items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50">
            <Trophy className="text-white w-7 h-7" />
          </div>
          <div className="text-right">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">דרגה נוכחית</p>
            <h3 className="text-white text-2xl font-black">שלב {level || 1}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
          <Zap size={16} className="text-amber-500 fill-amber-500" />
          <span className="text-amber-500 font-black text-sm">{streak || 0} ימי רצף</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-row-reverse justify-between items-end">
          <p className="text-white/60 text-sm font-black uppercase tracking-widest leading-none">התקדמות לשלב הבא</p>
          <p className="text-white font-black text-xl leading-none">{xp || 0} / {nextLevelXp} XP</p>
        </div>
        
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5 outline outline-1 outline-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="text-center p-4 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex justify-center mb-1"><Target size={16} className="text-slate-400" /></div>
             <p className="text-white font-black text-lg leading-none">{totalTasks || 0}</p>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">בוצעו</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex justify-center mb-1"><Star size={16} className="text-slate-400" /></div>
             <p className="text-white font-black text-lg leading-none">Top 10%</p>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">דירוג</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
