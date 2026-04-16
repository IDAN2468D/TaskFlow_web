"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles, BrainCircuit, Activity, Cpu } from "lucide-react";

interface IAISuiteContainerProps {
  children: React.ReactNode;
}

export default function AISuiteContainer({ children }: IAISuiteContainerProps) {
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
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 text-slate-50 overflow-x-hidden min-h-screen py-16 px-6 md:px-12"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <motion.header variants={item} className="flex flex-col md:flex-row-reverse justify-between items-center md:items-end mb-20 gap-10">
          <div className="text-center md:text-right space-y-4">
             <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-4 mb-2">
                <div className="px-5 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] shadow-lg">Strategic Intelligence</div>
                <div className="h-[1px] w-16 bg-indigo-500/30" />
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Enterprise Suite</span>
             </h1>
             <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed mx-auto md:mr-0">
                מערכת ה-Neuro-Core של TaskFlow&rlm;. כאן הכל קורה - פירוק משימות קולי, ניטור עומסים וניהול צוות אסטרטגי בזמן אמת&rlm;.
             </p>
          </div>

          <div className="relative group p-1 rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)]">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative bg-[#09090b] p-6 rounded-[38px] border border-white/10">
                <BrainCircuit className="w-16 h-16 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
             </div>
          </div>
        </motion.header>

        {children}
      </div>
    </motion.div>
  );
}
