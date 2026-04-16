"use client";

import React from "react";
import { motion } from "framer-motion";

interface IAIPulseIndicatorProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
}

export default function AIPulseIndicator({ 
  size = "md", 
  color = "bg-indigo-500", 
  label 
}: IAIPulseIndicatorProps) {
  const sizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4"
  };

  return (
    <div className="flex flex-row-reverse items-center gap-3">
      {label && (
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
          {label}
        </span>
      )}
      <div className="relative flex items-center justify-center">
        {/* Core Dot */}
        <div className={`${sizes[size]} ${color} rounded-full z-10`} />
        
        {/* Pulse Rings */}
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className={`absolute ${sizes[size]} ${color} rounded-full blur-[2px] opacity-40`}
        />
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
          className={`absolute ${sizes[size]} ${color} rounded-full blur-[4px] opacity-30`}
        />
        
        {/* Ambient Glow */}
        <div className={`absolute ${sizes[size]} ${color} rounded-full blur-[8px] opacity-20`} />
      </div>
    </div>
  );
}
