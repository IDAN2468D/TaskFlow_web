"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  ChevronRight, 
  Lightbulb, 
  Loader2, 
  CheckCircle2, 
  Circle,
  Clock,
  Tag,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BrainCircuit
} from "lucide-react";
import { generateTaskInsights } from "@/actions/aiActions";
import { toggleSubtaskAction, updateTaskStatusAction, deleteTaskAction } from "@/actions/taskActions";
import { formatDuration } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ITaskCardProps {
  task: any;
}

const TaskCard: React.FC<ITaskCardProps> = ({ task }) => {
  const [insights, setInsights] = useState(task.aiInsights || "");
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGetInsights = async () => {
    if (loading) return;
    if (insights && !expanded) {
      setExpanded(true);
      return;
    }

    setLoading(true);
    setExpanded(true);
    try {
      const updatedTask = await generateTaskInsights(task._id);
      setInsights(updatedTask.aiInsights);
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    try {
      await toggleSubtaskAction(task._id, subtaskId);
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
    }
  };

  const handleCycleStatus = async () => {
    const statusCycle: Record<string, string> = {
      Todo: "InProgress",
      InProgress: "Done",
      Done: "Todo",
    };
    const nextStatus = statusCycle[task.status] || "Todo";
    try {
      setIsUpdating(true);
      await updateTaskStatusAction(task._id, nextStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("האם למחוק משימה זו? לא ניתן לבטל פעולה זו.")) return;
    try {
      await deleteTaskAction(task._id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const priorityColors = {
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      className={`group relative bg-[#18181b]/30 backdrop-blur-2xl border border-white/5 hover:border-indigo-500/40 rounded-[32px] p-8 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col h-full ${
        task.status === "Done" ? "opacity-60" : ""
      }`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] opacity-5 transition-opacity group-hover:opacity-15 pointer-events-none ${
        task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-indigo-500'
      }`} />
      
      <div className="flex justify-between items-start mb-6 gap-4">
        <h3 className="text-2xl font-black text-white line-clamp-2 leading-[1.2] tracking-tight flex-1">
          {task.title}
        </h3>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors bg-white/5 border border-white/5"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[0.2em] shadow-lg ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
              {task.priority}
            </span>
          </div>
          
          {task.estimatedTime && (
            <div className="flex flex-col items-end gap-2">
               <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shadow-inner group/time">
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <div className="absolute inset-0 bg-indigo-500/30 blur-md rounded-full" />
                  </div>
                  <span className="text-[11px] font-black text-slate-100 tracking-tight">
                    {formatDuration(task.estimatedTime)}
                  </span>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCycleStatus}
          disabled={isUpdating}
          className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all shadow-xl ${
            isUpdating ? "opacity-50 cursor-wait" : ""
          } ${
            task.status === "Todo" ? "bg-zinc-800/80 text-zinc-500 border border-white/5" :
            task.status === "InProgress" ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" :
            "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          }`}
        >
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : (
            <>
              <div className={`w-2 h-2 rounded-full ${task.status === "Todo" ? "bg-zinc-600" : "bg-white animate-pulse"}`} />
              {task.status}
            </>
          )}
        </motion.button>

        {task.estimatedTime && task.estimatedTime > 240 && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-tight animate-pulse shadow-inner">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            עומס עבודה גבוה
          </div>
        )}
      </div>

      <p className="text-[15px] text-slate-400 mb-8 leading-relaxed line-clamp-3 font-medium">
        {task.description || "אין תיאור למשימה זו."}
      </p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-8">
          {task.tags.map((tag: string, i: number) => (
            <div key={`${task._id}-tag-${i}`} className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-default uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Subtasks */}
      <div className="space-y-3 mb-8 flex-1">
        {task.subTasks?.slice(0, 3).map((st: any) => (
          <motion.div 
            key={st._id} 
            whileHover={{ x: -4 }}
            className="group/item flex items-center gap-4 text-[14px] text-zinc-300 cursor-pointer bg-white/[0.02] p-3 rounded-2xl border border-transparent hover:border-white/5 transition-all"
            onClick={() => handleToggleSubtask(st._id)}
          >
            <div className="flex items-center justify-between w-full flex-row-reverse">
              <div className="flex flex-row-reverse items-center gap-4">
                {st.status === "Done" ? (
                  <div className="w-5 h-5 bg-emerald-500/20 rounded-full items-center justify-center flex border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-white/5 rounded-full items-center justify-center flex border border-white/10 group-hover/item:border-indigo-500/50">
                    <Circle className="w-3 h-3 text-zinc-600 transition-colors" />
                  </div>
                )}
                <span className={`truncate text-right font-bold ${st.status === "Done" ? "line-through text-zinc-600" : "text-slate-200"}`}>
                  {st.title}
                </span>
              </div>
              {st.estimatedTime && (
                <div className="flex flex-row-reverse items-center gap-2 px-2.5 py-1 bg-black/20 border border-white/5 rounded-lg">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span className="text-[10px] text-zinc-500 font-black whitespace-nowrap">
                    {formatDuration(st.estimatedTime)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {task.subTasks?.length > 3 && (
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest pr-4 flex flex-row-reverse items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            +{task.subTasks.length - 3} נוספים במשימה זו
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="flex flex-row-reverse items-center gap-3 text-xs text-slate-400 font-black uppercase tracking-tight">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : 'ללא יעד'}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetInsights}
          className="flex flex-row-reverse items-center gap-3 text-xs font-black text-indigo-400 transition-all bg-indigo-500/10 px-5 py-2.5 rounded-2xl border border-indigo-500/20 shadow-lg uppercase tracking-wide"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          תובנות AI
        </motion.button>
      </div>

      {/* AI Insights Expansion */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 shadow-inner relative">
              <div className="absolute top-0 right-0 p-4">
                <BrainCircuit className="w-12 h-12 text-indigo-500/10" />
              </div>
              <div className="flex flex-row-reverse justify-between items-center mb-4 relative z-10">
                <span className="text-[11px] uppercase tracking-[0.2em] font-black text-indigo-400">ניתוח אסטרטגי - אוליבר</span>
                <button onClick={() => setExpanded(false)} className="text-slate-500 hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              </div>
              <p className="text-[14px] text-slate-300 leading-relaxed italic relative z-10 text-right font-medium">
                {loading ? "מייצר תובנות חכמות..." : insights}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
