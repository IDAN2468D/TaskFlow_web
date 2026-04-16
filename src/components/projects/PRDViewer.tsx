"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Target, Zap, Layout, Clock, Sparkles } from "lucide-react";
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto mt-12 mb-20"
    >
      <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Banner Section */}
        <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent p-10 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-4 flex-row-reverse">
            <Rocket className="w-8 h-8 text-indigo-400" />
            <span className="text-xs font-black tracking-[0.2em] text-indigo-400 uppercase">תוכנית עבודה רשמית</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight text-right">
            {prd.productName}
          </h1>
          <p className="text-xl text-zinc-300 font-medium leading-relaxed max-w-2xl text-right ml-auto">
            {prd.elevatorPitch}
          </p>
        </div>

        <div className="p-10" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Right Column (Primary in RTL) */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">קהל יעד</h3>
                </div>
                <p className="text-zinc-200 leading-relaxed font-medium">
                  {prd.targetAudience}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">שפה עיצובית וחווית משתמש</h3>
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  {prd.designBrief}
                </p>
              </section>

              <section className="bg-zinc-800/30 p-6 rounded-3xl border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">לוח זמנים משוער</h3>
                </div>
                <p className="text-2xl font-black text-white">
                  {prd.estimatedDevTime}
                </p>
              </section>
            </div>

            {/* Left Column: Features */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">פיצ'רים מרכזיים</h3>
              </div>
              <div className="space-y-3">
                {prd.coreFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/30 hover:border-indigo-500/30 transition-colors group"
                  >
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                    <p className="text-zinc-300 font-medium group-hover:text-white transition-colors">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-row-reverse justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-400/60 text-xs font-bold uppercase italic">
              <Sparkles className="w-4 h-4" />
              נוצר על ידי TaskFlow AI Architect
            </div>
            
            <ExportToDriveButton projectId={projectId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
