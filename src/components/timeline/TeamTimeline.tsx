import React from 'react';
import { getRecentActivities } from '@/lib/actions/activity.actions';
import { 
  PlusCircle, 
  RotateCw, 
  Trash2, 
  Zap, 
  Target,
  Mic,
  Clock
} from 'lucide-react';

/**
 * TeamTimeline Component
 * Server Component that renders a real-time feed of team activities.
 */
export default async function TeamTimeline() {
  const result = await getRecentActivities(15);
  const activities = result.success ? result.data : [];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TASK_CREATED': return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case 'TASK_UPDATED': return <RotateCw className="w-4 h-4 text-amber-500" />;
      case 'TASK_DELETED': return <Trash2 className="w-4 h-4 text-rose-500" />;
      case 'AI_ASSIGNED': return <Zap className="w-4 h-4 text-indigo-500" />;
      case 'VOICE_TASK_CREATED': return <Mic className="w-4 h-4 text-indigo-400" />;
      default: return <Target className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatTimestamp = (date: string) => {
    return new Date(date).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4" />
          פעילות צוות&rlm;
        </h2>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      </div>

      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-sm">אין פעילויות אחרונות&rlm;</div>
        ) : (
          activities.map((activity: any) => (
            <div key={activity._id} className="relative pl-6 pb-2 border-l border-white/5 last:pb-0">
              <div className="absolute -left-[9px] top-1 bg-zinc-950 p-1">
                {getActionIcon(activity.action)}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {activity.userId?.name || 'מתחבר אנונימי'}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activity.details || activity.action.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
