"use client";

import React, { useState } from "react";
import PRDCreator from "./PRDCreator";
import PRDViewer from "./PRDViewer";
import { History, LayoutGrid, LayoutList } from "lucide-react";
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
  };

  return (
    <div className="space-y-16">
      {/* Creator Section */}
      <section>
        <PRDCreator onGenerated={handleGenerated} />
      </section>

      {/* Selected Result (If any) */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <section key={selectedProject._id}>
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-6 flex-row-reverse" dir="rtl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                המסמך שנוצר עכשיו
              </h2>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-sm font-medium text-zinc-500 hover:text-white transition-colors"
              >
                סגור תצוגה
              </button>
            </div>
            <PRDViewer prd={selectedProject} projectId={selectedProject._id} />
          </section>
        )}
      </AnimatePresence>

      {/* History Section */}
      <section dir="rtl">
        <div className="flex items-center gap-3 mb-8">
          <History className="w-6 h-6 text-zinc-600" />
          <h2 className="text-2xl font-bold">ארכיון הפרויקטים</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedProject(project)}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {project.productName}
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                {project.elevatorPitch}
              </p>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <span>{project.estimatedDevTime}</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
