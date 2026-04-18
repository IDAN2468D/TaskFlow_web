"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Loader2, 
  BrainCircuit, 
  Target, 
  Zap, 
  ArrowLeft, 
  Lightbulb, 
  FileText, 
  Layers, 
  ShieldCheck 
} from "lucide-react";
import { generatePRD } from "@/actions/aiActions";

interface PRDCreatorProps {
  onGenerated: (prd: any) => void;
}

export default function PRDCreator({ onGenerated }: PRDCreatorProps) {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;

    setLoading(true);
    try {
      const prd = await generatePRD(idea);
      if (prd) {
        onGenerated(prd);
        setIdea("");
      }
    } catch (error) {
      console.error(error);
      alert("יצירת האפיון נכשלה. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto px-6 py-12 relative"
    >
      {/* Premium Cinematic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[140px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16" dir="rtl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} />
            <span>AI Product Architect</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            הפוך <span className="bg-gradient-to-l from-indigo-400 to-indigo-600 bg-clip-text text-transparent">רעיון</span> לאפיון
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            שלח לנו תיאור קצר של המיזם הבא שלך, והבינה המלאכותית שלנו תייצר עבורך אפיון מוצר מלא, מפורט ומקצועי תוך שניות.
          </motion.p>
        </div>

        {/* Input Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          {/* Animated Glow Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/20 via-white/5 to-purple-500/20 rounded-[40px] blur-sm transition-opacity group-focus-within:opacity-100 opacity-50" />
          
          <div className="relative bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-white/5">
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8" dir="rtl">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Lightbulb size={16} className="text-indigo-500" />
                    תאור הרעיון שלך
                  </label>
                  <span className="text-[10px] text-zinc-600 font-mono italic">AI READY</span>
                </div>
                
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="לדוגמה: פלטפורמה מבוססת AI לניהול זמן עבור סטודנטים המשלבת למידה חברתית..."
                  className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-[30px] p-8 text-xl text-white placeholder:text-zinc-700 focus:outline-none focus:bg-white/[0.04] focus:border-indigo-500/30 transition-all resize-none leading-relaxed shadow-inner"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-indigo-500/20" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-tighter mr-2">אלפי רעיונות כבר הפכו למציאות</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !idea.trim()}
                  className="relative group/btn h-16 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-4 transition-all disabled:opacity-50 disabled:grayscale overflow-hidden shadow-lg shadow-indigo-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>מייצר אפיון...</span>
                    </>
                  ) : (
                    <>
                      <span>ג&apos;נרט אפיון מוצר</span>
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16" dir="rtl">
          {[
            { title: "ניתוח לוגי", desc: "מפרק רעיון לרכיבים", icon: BrainCircuit },
            { title: "מבנה מלא", desc: "כולל פונקציונליות וUX", icon: Layers },
            { title: "שפה מקצועית", desc: "אפיון מוכן למפתחים", icon: FileText },
            { title: "בדיקת היתכנות", desc: "זיהוי אתגרי פיתוח", icon: ShieldCheck }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 mb-4 group-hover:border-indigo-500/30 transition-all">
                <feature.icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="text-sm font-black text-white mb-1 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-xl"
            >
              <div className="text-center space-y-8 max-w-sm px-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500/50 blur-3xl rounded-full animate-pulse" />
                  <Loader2 size={80} className="text-indigo-500 animate-spin relative z-10 mx-auto" strokeWidth={1} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white tracking-tight">בינה מלאכותית בתהליך עבודה</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    אנחנו מנתחים את הרעיונות שלך, בונים את הארכיטקטורה ומנסחים את מסמך הדרישות הטכני. זה יקח רק כמה רגעים...
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </motion.div>
  );
}
