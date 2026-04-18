import React, { Suspense } from 'react';
import AISuiteContainer from '@/components/ai/AISuiteContainer';
import VoiceToTask from '@/components/ai/VoiceToTask';
import TeamTimeline from '@/components/timeline/TeamTimeline';
import { Mic2, Activity, Cpu, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";

export default function AISuitePage() {
  return (
    <AISuiteContainer>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: AI Tools & Performance */}
        <div className="lg:col-span-4 space-y-12">
          <section className="space-y-6">
            <div className="flex flex-row-reverse items-center gap-4 px-4">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                <Mic2 className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.25em]">Voice Processor</h2>
            </div>
            
            <div className="hover:scale-[1.02] transition-transform duration-500">
              <VoiceToTask />
            </div>
          </section>

          <section className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-10 rounded-outer bg-surface-mid/50 backdrop-blur-3xl border border-white/5 space-y-8 shadow-2xl overflow-hidden">
              <div className="flex flex-row-reverse items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tight">AI Insights Pool</h3>
                <Cpu className="w-5 h-5 text-indigo-400/50" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-inner bg-black/40 border border-white/5 group/stat hover:border-indigo-500/30 transition-colors">
                  <p className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mb-2 text-right">Voice Logs</p>
                  <p className="text-4xl font-black text-indigo-400 group-hover:scale-110 transition-transform origin-right">12</p>
                </div>
                <div className="p-6 rounded-inner bg-black/40 border border-white/5 group/stat hover:border-emerald-500/30 transition-colors">
                  <p className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mb-2 text-right">Accuracy</p>
                  <p className="text-4xl font-black text-emerald-400 group-hover:scale-110 transition-transform origin-right">98%</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                 <div className="flex flex-row-reverse items-center justify-between text-[11px] font-black text-slate-500 uppercase mb-3">
                    <span>Neural Load</span>
                    <span className="text-indigo-400">Stable</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Timeline & Live Monitor */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6">
            <div className="flex flex-row-reverse items-center gap-4 px-4">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.25em]">Real-time Team Activity</h2>
            </div>

            <div className="bg-surface-mid/30 backdrop-blur-2xl rounded-outer border border-white/5 overflow-hidden shadow-2xl min-h-[600px]">
              <Suspense fallback={
                <div className="h-[600px] w-full flex flex-col items-center justify-center gap-6">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Synchronizing Neural Data...&rlm;</span>
                </div>
              }>
                <TeamTimeline />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </AISuiteContainer>
  );
}
