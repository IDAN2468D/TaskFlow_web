"use client";

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  BrainCircuit, 
  Zap, 
  ChevronRight,
  Activity,
  Cpu,
  Flame,
  Star,
  Shield,
  Layers,
  Volume2,
  VolumeX,
  MessageSquareQuote,
  Loader2
} from 'lucide-react';
import { getTopPriorityTask } from '@/actions/taskActions';
import { getStrategicBriefingAction } from '@/actions/aiActions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import { ITask } from '@/models/Task';

export default function FocusModePage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  
  // Briefing State
  const [briefing, setBriefing] = useState("");
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    getTopPriorityTask()
      .then(task => {
        if (task) setActiveTask(task);
      })
      .catch(err => console.error("Could not fetch top task", err));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    const times: Record<string, number> = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
    setTimeLeft(times[mode]);
  };

  const switchMode = (newMode: string) => {
    setMode(newMode);
    setIsActive(false);
    const times: Record<string, number> = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
    setTimeLeft(times[newMode]);
  };

  const generateBriefing = async () => {
    if (showBriefing) {
      setShowBriefing(false);
      stopBriefing();
      return;
    }
    
    setIsBriefingLoading(true);
    setShowBriefing(true);
    try {
      const result = await getStrategicBriefingAction();
      setBriefing(result);
    } catch (err) {
      console.error("Failed to generate briefing", err);
      setBriefing("שגיאה ביצירת תדרוך. נסה שוב מאוחר יותר.");
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const startBriefingAudio = () => {
    if (!briefing || typeof window === 'undefined') return;
    
    // Stop any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(briefing);
    utterance.lang = 'he-IL';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopBriefing = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maxTime = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const percentage = timeLeft / maxTime;
  const strokeDasharray = 816; // 2 * PI * 130
  const strokeDashoffset = strokeDasharray * (1 - percentage);

  // Stagger variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 relative overflow-hidden flex items-center justify-center p-6 selection:bg-indigo-500/30">
      {/* Dynamic Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#6366f1 1.5px, transparent 1.5px)`, backgroundSize: '60px 60px' }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center"
      >
        {/* Left Side: Mission Control Info */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div variants={itemVariants} className="space-y-6 text-right">
            <div className="flex flex-row-reverse items-center gap-4">
              <div className="inline-flex flex-row-reverse items-center gap-3 bg-indigo-500/10 px-5 py-2.5 rounded-2xl border border-indigo-500/20 shadow-2xl">
                <div className="relative">
                  <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20 animate-pulse" />
                  <div className="absolute inset-0 bg-indigo-400 blur-sm opacity-50" />
                </div>
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[4px]">Mission Status: Active</span>
              </div>
              
              <button 
                onClick={generateBriefing}
                className={`flex flex-row-reverse items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${
                  showBriefing 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <MessageSquareQuote size={18} className={showBriefing ? "animate-bounce" : ""} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">תדרוך אסטרטגי</span>
              </button>
            </div>
            
            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
              זמן <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-indigo-600 relative">
                ביצוע.
                <motion.div 
                   animate={{ width: ['0%', '100%', '0%'] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-1 left-0 h-1.5 bg-indigo-500/30 rounded-full blur-sm"
                />
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl mr-0 ml-auto text-right">
              התרכז במטרה אחת&rlm;. המשימה שלך היא לבצע&rlm;.<br/>
              כל השאר יכול לחכות&rlm;.
            </p>
          </motion.div>

          {/* Active Task Telemetry Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#18181b]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative group overflow-hidden border-r-indigo-500/50 border-r-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative flex flex-row-reverse items-center justify-between mb-10">
               <div className="flex flex-row-reverse items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black text-indigo-400 uppercase tracking-[3px] text-right leading-none mb-1">מטרה נוכחית</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">High Priority Protocol</p>
                  </div>
               </div>
               <Activity className="w-6 h-6 text-slate-700 animate-pulse" />
            </div>

            <p className="text-3xl font-black text-white text-right leading-tight mb-8">
              {activeTask ? activeTask.title : "ממתין לפקודה: בחר משימה להתמקדות&rlm;"}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">System State</p>
                   <div className="flex flex-row-reverse items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-white">DEEP WORK</span>
                   </div>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Focus Mode</p>
                   <div className="flex flex-row-reverse items-center gap-2">
                      <BrainCircuit size={14} className="text-indigo-400" />
                      <span className="text-xs font-black text-white uppercase">{mode}</span>
                   </div>
                </div>
            </div>

            {/* Briefing Overlay Panel */}
            <AnimatePresence>
              {showBriefing && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 pt-8 border-t border-indigo-500/30 overflow-hidden"
                >
                   <div className="flex flex-row-reverse items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[3px]">תדרוך מודיעין AI</span>
                      <div className="flex items-center gap-2">
                        {isBriefingLoading ? (
                          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        ) : (
                          <button 
                            onClick={isSpeaking ? stopBriefing : startBriefingAudio}
                            className={`p-2 rounded-xl transition-all ${
                              isSpeaking ? "bg-red-500/20 text-red-500" : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                            }`}
                          >
                            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                          </button>
                        )}
                      </div>
                   </div>
                   <div className="bg-indigo-500/5 rounded-3xl p-6 border border-indigo-500/10 min-h-[100px] relative">
                      {isBriefingLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-4">
                           <div className="flex gap-1">
                              {[0, 1, 2].map(i => (
                                <motion.div 
                                  key={i}
                                  animate={{ scaleY: [0.5, 1.5, 0.5] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                  className="w-1 h-4 bg-indigo-500 rounded-full"
                                />
                              ))}
                           </div>
                           <p className="text-xs font-medium text-slate-500">מנתח יעדים אסטרטגיים...</p>
                        </div>
                      ) : (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-slate-300 leading-relaxed text-right italic"
                        >
                          {briefing}
                        </motion.p>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: High-Tech Cinematic Timer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center perspective-[1000px]">
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            {/* Outer Cyber Rings */}
            <div className="absolute inset-[-60px] border border-white/[0.03] rounded-full scale-110" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-100px] border-[1px] border-dashed border-indigo-500/10 rounded-full" 
            />
            
            <div className="relative w-[500px] h-[500px] flex items-center justify-center">
              {/* The "Breathing" Glow */}
              <motion.div 
                 animate={{ scale: isActive ? [1, 1.05, 1] : 1, opacity: isActive ? [0.3, 0.5, 0.3] : 0.2 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 bg-indigo-500/5 blur-[80px] rounded-full"
              />

              <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                {/* Background Track */}
                <circle
                  cx="250"
                  cy="250"
                  r="130"
                  className="stroke-white/[0.05] fill-none"
                  strokeWidth="4"
                  style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                />
                {/* Active Progress */}
                <motion.circle
                  cx="250"
                  cy="250"
                  r="130"
                  className="stroke-indigo-500 fill-none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: strokeDasharray }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                />
                {/* Glow Point at the end of progress */}
                <motion.circle
                  cx="250"
                  cy="250"
                  r="130"
                  className="stroke-white fill-none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`1 2000`}
                  animate={{ opacity: isActive ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ 
                    transform: `scale(1.5) rotate(${360 * percentage}deg)`, 
                    transformOrigin: 'center' 
                  }}
                />
              </svg>

              <div className="text-center z-10 flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={timeLeft}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[130px] font-black text-white tracking-[-6px] leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" style={{ fontVariantNumeric: 'tabular-nums shadow-xl shadow-indigo-900/40' }}>
                      {formatTime(timeLeft)}
                    </span>
                    
                    <motion.div 
                      className="mt-6 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex flex-row-reverse gap-3 items-center backdrop-blur-md"
                    >
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500 animate-ping' : 'bg-slate-700'}`} />
                      <span className="text-xs font-black text-indigo-100 uppercase tracking-[4px]">
                        {mode === 'focus' ? 'FOCUS PROTOCOL' : 'REST NEURONS'}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Float Controls Glass Base */}
            <div className="absolute -bottom-8 w-full flex justify-center">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#18181b]/80 backdrop-blur-3xl border border-white/10 rounded-full p-2.5 flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
              >
                {[
                  { id: 'focus', label: 'Work', icon: Flame },
                  { id: 'shortBreak', label: 'Short', icon: Star },
                  { id: 'longBreak', label: 'Long', icon: Layers },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchMode(m.id)}
                    className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 group/btn ${
                      mode === m.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <m.icon size={14} className={mode === m.id ? 'text-white' : 'text-slate-600 group-hover/btn:text-indigo-400'} />
                    {m.label}
                  </button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Cinematic Action Buttons */}
          <motion.div variants={itemVariants} className="mt-28 flex items-center gap-10">
            <button 
              onClick={resetTimer}
              className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all group scale-90 hover:scale-100"
            >
              <RotateCcw className="w-7 h-7 text-slate-500 group-hover:text-white transition-all group-hover:rotate-[-90deg]" />
            </button>

            <button 
              onClick={toggleTimer}
              className="w-32 h-32 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(99,102,241,0.6)] hover:bg-indigo-500 transform transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 bg-black/10 rounded-full scale-110 group-active:scale-90 transition-transform">
                {isActive ? 
                  <Pause className="w-12 h-12 text-white fill-white relative z-10" /> : 
                  <Play className="w-12 h-12 text-white fill-white ml-2 relative z-10" />
                }
              </div>
            </button>

            <button className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 hover:bg-indigo-600/20 transition-all group scale-90 hover:scale-100">
               <Cpu className="w-7 h-7 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
