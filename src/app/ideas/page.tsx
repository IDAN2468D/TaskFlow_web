import React from "react";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { serializeProject } from "@/lib/utils";
import ClientProjectsWrapper from "@/components/projects/ClientProjectsWrapper";
import { Sparkles, Zap, BrainCircuit, Activity, MousePointer2 } from "lucide-react";

export default async function ProjectsPage() {
  await dbConnect();

  // Fetch all projects for simplicity (In real app, filter by userId)
  const projects = await Project.find({}).sort({ createdAt: -1 });
  const serializedProjects = projects.map(serializeProject);

  return (
    <main className="min-h-screen text-slate-50 py-20 px-6 relative overflow-x-hidden bg-[#020617] selection:bg-indigo-500/30">
      {/* Premium Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] right-[5%] w-[30%] h-[30%] bg-purple-600/5 blur-[130px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] noise-overlay" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col items-center text-center mb-32" dir="rtl">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[4px] mb-10 backdrop-blur-xl">
            <Sparkles size={14} className="animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <span>AI Powered Innovation Lab v4.0</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.85]">
            מעבדת <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 via-indigo-500 to-indigo-800 drop-shadow-2xl">הרעיונות</span>
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-10">
            <p className="text-2xl md:text-3xl text-slate-400 font-medium leading-relaxed tracking-tight">
              המנוע שהופך רעיונות גולמיים לארכיטקטורת מוצר מושלמת בתוך שניות&rlm;.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-10 py-8 border-y border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 group-hover:scale-110 transition-transform">
                   <BrainCircuit size={20} className="text-indigo-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-[3px] text-slate-400 group-hover:text-slate-200 transition-colors">Deep AI Analysis</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:scale-110 transition-transform">
                   <Zap size={20} className="text-amber-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-[3px] text-slate-400 group-hover:text-slate-200 transition-colors">Instant Architecture</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:scale-110 transition-transform">
                   <Activity size={20} className="text-emerald-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-[3px] text-slate-400 group-hover:text-slate-200 transition-colors">Live Feasibility</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-slate-500 animate-bounce">
             <MousePointer2 size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Create</span>
          </div>
        </header>

        {/* Client side wrapper to handle real-time UI states */}
        <ClientProjectsWrapper initialProjects={serializedProjects} />
      </div>
    </main>
  );
}


