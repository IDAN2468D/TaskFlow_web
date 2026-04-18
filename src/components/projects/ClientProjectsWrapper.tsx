"use client";

import React, { useState } from "react";
import PRDCreator from "./PRDCreator";
import PRDViewer from "./PRDViewer";
import { History, LayoutGrid, LayoutList, Calendar, ChevronLeft, Boxes } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClientProjectsWrapperProps {
  initialProjects: any[];
}

export default function ClientProjectsWrapper({ initialProjects }: ClientProjectsWrapperProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleGenerated = (newProject: any) => {
    setProjects([newProject, ...projects]);
    setSelectedProject(newProject);
    // Smooth scroll to results
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24">
      {/* Creator Section */}
      <section>
        <PRDCreator onGenerated={handleGenerated} />
      </section>

      {/* Selected Result (If any) */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.section 
            key={selectedProject._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="flex items-center justify-between max-w-5xl mx-auto mb-8 border-b border-white/5 pb-4 flex-row-reverse" dir="rtl">
              <div className="flex flex-row-reverse items-center gap-3">
                <Boxes className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-black text-white tracking-tight">
                  האפיון הנבחר
                </h2>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
              >
                סגור תצוגה
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <PRDViewer prd={selectedProject} projectId={selectedProject._id} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* History Section */}
      <section dir="rtl" className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <History className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">ארכיון המיזמים</h2>
            <p className="text-zinc-500 text-sm font-medium">היסטוריית הרעיונות והאפיונים שיצרת</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedProject(project)}
              className="group relative bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex flex-row-reverse justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex flex-row-reverse items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-indigo-400 transition-colors">
                    <Calendar size={10} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">
                  {project.productName}
                </h3>
                
                <p className="text-sm text-zinc-500 line-clamp-2 mb-8 font-medium leading-relaxed">
                  {project.elevatorPitch}
                </p>
                
                <div className="flex flex-row-reverse items-center justify-between">
                  <div className="flex flex-row-reverse items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">מוכן לעבודה</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {project.estimatedDevTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

