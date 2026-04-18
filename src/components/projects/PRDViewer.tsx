"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Target, Zap, Layout, Clock, Sparkles, Shapes, UserCircle2 } from "lucide-react";
import ExportToDriveButton from "./ExportToDriveButton";

interface PRDViewerProps {
  projectId: string;
  prd: {
    productName: string;
    elevatorPitch: string;
    targetAudience: string;
    designBrief: string;
    coreFeatures: string[];
    estimatedDevTime: string;
  };
}

export default function PRDViewer({ prd, projectId }: PRDViewerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto mt-12 mb-32"
    >
      <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -mr-64 -mt-64" />
        
        {/* Hero Section */}
        <div className="relative z-10 p-12 md:p-16 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-row-reverse items-center justify-between gap-6 mb-8">
            <div className="flex flex-row-reverse items-center gap-3">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30">
                <Rocket className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="text-right">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">מסמך אפיון רשמי</span>
                <div className="h-[2px] w-12 bg-indigo-500 rounded-full mr-0 ml-auto" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter text-right leading-none">
            {prd.productName}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl text-right ml-auto italic border-r-4 border-indigo-500/30 pr-6">
            &quot;{prd.elevatorPitch}&quot;
          </p>
        </div>

        {/* Content Grid */}
        <div className="relative z-10 p-12 md:p-16" dir="rtl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Primary Details (8 columns) */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-16 text-right">
              
              <motion.section variants={item}>
                <div className="flex flex-row-reverse items-center gap-3 mb-6">
                  <UserCircle2 className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">קהל יעד ואסטרטגיה</h3>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] shadow-inner">
                  <p className="text-xl text-zinc-200 leading-relaxed font-semibold">
                    {prd.targetAudience}
                  </p>
                </div>
              </motion.section>

              <motion.section variants={item}>
                <div className="flex flex-row-reverse items-center gap-3 mb-6">
                  <Shapes className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">חזון עיצובי וקונספט UX</h3>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] shadow-inner">
                  <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                    {prd.designBrief}
                  </p>
                </div>
              </motion.section>

              <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-950/40 p-10 rounded-[40px] border border-indigo-500/20 shadow-2xl relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex flex-row-reverse items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-amber-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">MVP Timeline</h3>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">
                      {prd.estimatedDevTime}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/40 p-10 rounded-[40px] border border-purple-500/20 shadow-2xl relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-full bg-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                     <div className="flex flex-row-reverse items-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/80">AI Priority</h3>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter uppercase">High Fidelity</p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Features Sidebar (4 columns) */}
            <div className="lg:col-span-12 xl:col-span-4">
              <motion.div variants={item} className="sticky top-8">
                <div className="flex flex-row-reverse items-center gap-3 mb-8 px-2">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">פיצ&apos;רים מרכזיים</h3>
                </div>
                
                <div className="space-y-4">
                  {prd.coreFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className="flex flex-row-reverse items-start gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all group shadow-sm hover:shadow-indigo-500/10"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform" />
                      <p className="text-zinc-200 font-bold text-right flex-1 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] backdrop-blur-md">
                   <div className="flex flex-row-reverse justify-between items-center gap-4">
                      <div className="text-right">
                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">פעולות נוספות</p>
                        <p className="text-white font-bold text-sm">יצוא מסמך לצוות</p>
                      </div>
                      <ExportToDriveButton projectId={projectId} />
                   </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-row-reverse justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Generated by TaskFlow Architect Engine v2.0
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

