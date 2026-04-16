"use client";

import React, { useState } from "react";
import { Plus, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { assignSkillToUserAction, removeSkillFromUserAction } from "@/actions/userActions";
import SkillBadge from "@/components/ui/SkillBadge";
import { AnimatePresence } from "framer-motion";

interface Skill {
  _id: string;
  name: string;
  color?: string;
}

interface UserSkillsManagerProps {
  currentSkills: Skill[];
  allAvailableSkills: Skill[];
}

const UserSkillsManager: React.FC<UserSkillsManagerProps> = ({ 
  currentSkills, 
  allAvailableSkills 
}) => {
  const [isPending, setIsPending] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    setIsPending(true);
    try {
      await assignSkillToUserAction(selectedSkillId);
      setSelectedSkillId("");
    } catch (error) {
      console.error("Failed to add skill", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    setIsPending(true);
    try {
      await removeSkillFromUserAction(skillId);
    } catch (error) {
      console.error("Failed to remove skill", error);
    } finally {
      setIsPending(false);
    }
  };

  // Filter out skills the user already has
  const unassignedSkills = allAvailableSkills.filter(
    (s) => !currentSkills.some((cs) => cs._id === s._id)
  );

  return (
    <div className="bg-[#18181b] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      <div className="relative flex flex-col gap-8">
        {/* Header Section (RTL) */}
        <div className="flex flex-row-reverse items-center justify-between">
          <div className="flex flex-row-reverse items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <BrainCircuit className="text-indigo-400" size={24} />
            </div>
            <div className="text-right">
              <h3 className="text-xl font-black text-white tracking-tight">ניהול מיומנות</h3>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Skill Matrix Protocol</p>
            </div>
          </div>
          
          <div className="flex flex-row-reverse items-center gap-3">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={isPending}
              className="bg-black/40 border border-white/10 text-slate-300 text-xs font-bold rounded-2xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all appearance-none min-w-[160px] text-right"
              dir="rtl"
            >
              <option value="">בחר מיומנות...</option>
              {unassignedSkills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleAddSkill}
              disabled={isPending || !selectedSkillId}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50 text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
            </button>
          </div>
        </div>

        {/* Skills Display Area (RTL Flex) */}
        <div className="flex flex-wrap flex-row-reverse gap-3 min-h-[40px]">
          <AnimatePresence mode="popLayout">
            {currentSkills.length > 0 ? (
              currentSkills.map((skill) => (
                <SkillBadge
                  key={skill._id}
                  name={skill.name}
                  color={skill.color}
                  onRemove={() => handleRemoveSkill(skill._id)}
                />
              ))
            ) : (
              <div className="w-full text-center py-6 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                <p className="text-sm font-medium text-slate-500">טרם הוגדרו מיומנויות ללוחם זה</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Footer */}
        <div className="flex flex-row-reverse items-center justify-between pt-6 border-t border-white/5">
          <div className="flex flex-row-reverse items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Total Proficiency</p>
                <div className="flex flex-row-reverse items-center gap-2">
                   <Sparkles size={12} className="text-amber-400" />
                   <span className="text-lg font-black text-white">{(currentSkills.length * 15).toString().padStart(2, '0')}%</span>
                </div>
             </div>
          </div>
          <div className="px-4 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[2px]">Core Sync: {isPending ? 'Syncing...' : 'Stable'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSkillsManager;
