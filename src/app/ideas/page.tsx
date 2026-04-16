import React from "react";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { serializeProject } from "@/lib/utils";
import PRDCreator from "@/components/projects/PRDCreator";
import PRDViewer from "@/components/projects/PRDViewer";
import { Rocket, History } from "lucide-react";
import ClientProjectsWrapper from "@/components/projects/ClientProjectsWrapper";

export default async function ProjectsPage() {
  await dbConnect();

  // Fetch all projects for simplicity (In real app, filter by userId)
  const projects = await Project.find({}).sort({ createdAt: -1 });
  const serializedProjects = projects.map(serializeProject);

  return (
    <main className="min-h-screen text-slate-50 p-8">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <header className="flex items-center gap-4 mb-16 border-b border-[#27272a] pb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">מעבדת הרעיונות</h1>
            <p className="text-slate-400 font-medium mt-1 text-lg">הפוך רעיונות מופשטים למסמך דרישות טכני מסודר ועשיר.</p>
          </div>
        </header>

        {/* Client side wrapper to handle real-time UI states */}
        <ClientProjectsWrapper initialProjects={serializedProjects} />
      </div>
    </main>
  );
}
