import React from "react";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { serializeTask, serializeUser } from "@/lib/utils";
import SmartInput from "@/components/tasks/SmartInput";
import TaskBoard from "@/components/tasks/TaskBoard";
import { Sparkles, LayoutDashboard, BrainCircuit, TrendingUp } from "lucide-react";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-123';

import DashboardContainer from "@/components/layout/DashboardContainer";

export default async function Home() {
  await dbConnect();
  
  // Get User Profile from Cookie
  const cookieStore = await cookies();
  const token = (await cookieStore).get('token')?.value;
  let userData = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.userId) {
        const rawUser = await User.findById(decoded.userId).select('name email avatar').lean();
        userData = serializeUser(rawUser);
      }
    } catch (err) {
      console.error("Auth verify error in dashboard:", err);
    }
  }

  // Fetch tasks sorted by newest first
  const tasks = await Task.find({}).sort({ createdAt: -1 });
  const serializedTasks = tasks.map(serializeTask);

  const activeCount = serializedTasks.filter((t: any) => t.status?.trim().toLowerCase() !== 'done').length;
  const doneCount = serializedTasks.filter((t: any) => t.status?.trim().toLowerCase() === 'done').length;

  return (
    <DashboardContainer 
      userData={userData} 
      activeCount={activeCount} 
      doneCount={doneCount}
    >
      {/* AI Spotlight Input */}
      <section>
        <SmartInput />
      </section>

      {/* Main Content: Task Board */}
      <section>
        <div className="flex flex-row-reverse items-center justify-between mb-10 px-4">
          <div className="flex flex-row-reverse items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">המשימות שלך</h2>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            מעודכן לזמן אמת
          </div>
        </div>
        
        <TaskBoard initialTasks={serializedTasks} />
      </section>
    </DashboardContainer>
  );
}
