"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Mic, MicOff, AlertCircle, Send, Brain, Rocket, Lightbulb, Zap } from "lucide-react";
import { useSmartInput } from "@/hooks/useSmartInput";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  { text: "צור לו״ז למידה למבחן", icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { text: "תכנן לי דף נחיתה לעסק", icon: Rocket, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { text: "אופטימיזציה ליום העבודה", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { text: "פרק פרויקט מורכב למשימות", icon: Lightbulb, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const SmartInput = () => {
  const {
    prompt,
    setPrompt,
    loading,
    isListening,
    error,
    setError,
    toggleListening,
    handleSubmit,
    isVoiceInput
  } = useSmartInput();

  useEffect(() => {
    if (isVoiceInput && isListening === false && prompt.length > 0 && !loading) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [prompt, isListening, isVoiceInput, loading, handleSubmit]);

  return (
    <div className="sticky top-6 z-[60] w-full max-w-5xl mx-auto px-6 mb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* Premium Suggestion Chips */}
        <div className="flex flex-row-reverse flex-wrap gap-4 justify-center">
          <AnimatePresence>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                type="button"
                onClick={() => setPrompt(s.text)}
                className={`flex flex-row-reverse items-center gap-3 px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-3xl transition-all duration-300 ${s.bg}`}
              >
                <s.icon className={`w-4 h-4 ${s.color} animate-pulse`} />
                <span className="text-white text-[13px] font-black tracking-tight">{s.text}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <form
          onSubmit={handleSubmit}
          className="group relative flex flex-col items-center w-full"
        >
          {/* Luminous Glow Backdrop */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 rounded-[42px] blur-3xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-1000 animate-pulse" />
          
          <div className="relative flex items-center w-full bg-[#18181b]/60 backdrop-blur-[40px] border border-white/10 group-focus-within:border-indigo-500/50 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500">
            {/* AI Status Pulsing Indicator */}
            <div className="pl-8 pr-2">
              <div className="relative">
                {loading ? (
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="relative group/sparkle">
                    <Sparkles className="w-8 h-8 text-slate-500 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-50 transition-opacity" />
                    {isListening && (
                      <motion.div 
                        layoutId="listening-halo"
                        className="absolute inset-0 bg-red-500/40 rounded-full blur-xl"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.3, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <input
              type="text"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError(null);
              }}
              placeholder={isListening ? "מקשיב לאסטרטג..." : "מה היעד הבא שלך? אוליבר כאן כדי לפרק אותו למשימות..."}
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-8 px-6 text-2xl font-black tracking-tight"
              dir="rtl"
              disabled={loading}
            />

            {/* Premium Actions Container */}
            <div className="flex items-center gap-4 pr-6 pl-4">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: isListening ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={toggleListening}
                disabled={loading}
                className={`p-4 rounded-[24px] transition-all duration-300 relative border border-transparent ${
                  isListening 
                    ? "bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-white bg-white/5"
                }`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !prompt.trim() || isListening}
                className="group/btn relative flex flex-row-reverse items-center gap-4 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 text-white font-black text-base uppercase tracking-widest rounded-[24px] transition-all duration-300 shadow-2xl shadow-indigo-500/30 overflow-hidden border border-indigo-500/20"
              >
                <div className="relative z-10 flex flex-row-reverse items-center gap-4">
                  <span>{loading ? "מנתח נתונים..." : "בצע פירוק"}</span>
                  <Send className={`w-5 h-5 transition-transform group-hover/btn:translate-x-[-5px] group-hover/btn:translate-y-[-5px]`} />
                </div>
                {/* Premium Shine Swipe */}
                <motion.div
                  initial={{ x: "-100%", skewX: -45 }}
                  animate={{ x: "200%" }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mt-6 flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-8 py-4 rounded-[28px] shadow-2xl backdrop-blur-3xl"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-[15px] font-black tracking-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default SmartInput;
