"use client";

import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { runIdle } from "@/lib/performance";

interface ITaskBoardProps {
  initialTasks: any[];
}

import { motion, AnimatePresence } from "framer-motion";

const TaskBoard: React.FC<ITaskBoardProps> = ({ initialTasks }) => {
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (visibleCount < initialTasks.length) {
      const handle = setTimeout(() => {
        runIdle(() => {
          setVisibleCount(prev => Math.min(prev + 12, initialTasks.length));
        });
      }, 50);
      return () => clearTimeout(handle);
    }
  }, [visibleCount, initialTasks.length]);

  if (!initialTasks || initialTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 px-4 text-center glass rounded-outer border-white/5 shadow-2xl"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        >
          <span className="text-5xl">🎯</span>
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">
          הלו״ז שלך פנוי כרגע
        </h2>
        <p className="text-slate-400 max-w-sm text-lg leading-relaxed font-medium">
          השתמש בשורת החיפוש החכמה כדי לתכנן את הפרויקט הבא שלך בעזרת אוליבר&rlm;.
        </p>
      </motion.div>
    );
  }

  const tasksToShow = initialTasks.slice(0, visibleCount);

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32"
    >
      <AnimatePresence mode="popLayout">
        {tasksToShow.map((task) => (
          <motion.div
            key={task._id}
            layout
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {visibleCount < initialTasks.length && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full py-16 flex justify-center"
        >
           <div className="flex items-center gap-3 text-indigo-400 font-black bg-surface-low px-8 py-3 rounded-button border border-white/10 shadow-xl backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="tracking-tight uppercase text-sm">טוען משימות נוספות...</span>
           </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskBoard;
