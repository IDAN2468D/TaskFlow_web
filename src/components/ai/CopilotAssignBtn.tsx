'use client';

import React, { useTransition } from 'react';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import { autoAssignTask } from '@/lib/actions/ai.actions';
import { toast } from 'sonner';

interface Props {
  taskId: string;
  currentSkillName?: string;
}

/**
 * CopilotAssignBtn Component
 * A smart assistant button that triggers AI-based skill matching for a task.
 */
export default function CopilotAssignBtn({ taskId, currentSkillName }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    startTransition(async () => {
      try {
        const result = await autoAssignTask(taskId);
        if (result.success) {
          toast.success('ה-Copilot זיהה את המיומנות הנדרשת!&rlm;', {
            description: `נמצאה התאמה ל: ${result.skillName}`,
            icon: <Sparkles className="w-4 h-4 text-amber-400" />
          });
        } else {
          toast.error('ה-Copilot לא הצליח למצוא התאמה&rlm;', {
            description: result.error
          });
        }
      } catch (err) {
        toast.error('שגיאת תקשורת עם ה-AI&rlm;');
      }
    });
  };

  return (
    <button
      onClick={handleAssign}
      disabled={isPending}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold transition-all duration-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className={`w-4 h-4 ${isPending ? '' : 'animate-pulse'}`} />
      )}
      
      {currentSkillName ? (
        <span>עדכון שיוך AI</span>
      ) : (
        <span>שיוך אוטומטי (Copilot)</span>
      )}

      {!isPending && (
        <div className="absolute top-0 right-0 -mr-1 -mt-1 w-2 h-2 bg-indigo-500 rounded-full blur-[2px]" />
      )}
    </button>
  );
}
