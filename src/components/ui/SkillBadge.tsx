"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface SkillBadgeProps {
  name: string;
  color?: string;
  onRemove?: () => void;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, color = "#6366f1", onRemove }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
      style={{ borderLeftColor: color, borderLeftWidth: onRemove ? "4px" : "1px" }}
    >
      <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );
};

export default SkillBadge;
