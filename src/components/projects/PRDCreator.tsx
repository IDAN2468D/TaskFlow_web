"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2 } from "lucide-react";
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
      alert("Failed to generate PRD. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative group">
        {/* Glowing Background Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">מרעיון למסמך PRD (אפיקיציה)</h2>
              <p className="text-sm text-zinc-500">תאר את הרעיון שלך וה-AI יבנה עבורך את תוכנית העבודה המלאה.</p>
            </div>
          </div>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="למשל: אני רוצה לבנות פלטפורמה שמחברת בין חקלאים לצרכנים ישירות, עם מערכת המלצות חכמה..."
            className="w-full h-40 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none mb-6 text-right"
            dir="rtl"
          />

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex-row-reverse"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  בונה את המסמך...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  צור PRD חכם
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
