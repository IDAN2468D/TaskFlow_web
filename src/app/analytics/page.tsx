import React from "react";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { Brain, TrendingUp, Clock, CheckCircle2, Zap, BarChart3, Target } from "lucide-react";

export default async function AnalyticsPage() {
  await dbConnect();
  const tasks = await Task.find({});
  const doneTasks = tasks.filter(t => t.status === 'Done');
  const activeTasks = tasks.filter(t => t.status !== 'Done');
  
  // Calculate total minutes saved (estimating 15 mins saved per AI decomposed task)
  const totalMinutesSaved = tasks.filter(t => t.subTasks && t.subTasks.length > 0).length * 15;

  return (
    <main className="p-10 space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white">אנליטיקה וביצועים</h1>
        <p className="text-slate-400 font-medium">כך ה-AI עוזרת לך להשיג יותר בכל יום&rlm;</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Zap, label: "זמן שנחסך ע\"י AI", value: `${totalMinutesSaved} דק'`, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { icon: Target, label: "משימות פעילות", value: activeTasks.length, color: "text-amber-400", bg: "bg-amber-500/10" },
          { icon: CheckCircle2, label: "יעדי הצלחה", value: doneTasks.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: TrendingUp, label: "ציון פרודוקטיביות", value: "92%", color: "text-indigo-500", bg: "bg-indigo-500/20" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#18181b] border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 shadow-xl">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart Visual Dummy */}
        <div className="lg:col-span-2 bg-[#18181b] border border-white/5 rounded-[32px] p-8 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-indigo-500" />
              <h3 className="text-xl font-bold text-white">מגמת ביצוע שבועי</h3>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase">7 ימים אחרונים</div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3 px-4">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full bg-indigo-500/20 rounded-t-xl relative group-hover:bg-indigo-500/40 transition-all duration-500"
                  style={{ height: `${h}%` }}
                >
                  {h === 100 && <div className="absolute -top-1 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] rounded-full animate-pulse" />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-[#18181b] border border-white/5 rounded-[32px] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Brain className="text-indigo-400" />
            <h3 className="text-xl font-bold text-white">המלצות בינה מלאכותית</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { text: "נראה שאתה הכי פרודוקטיבי ב-10 בבוקר. מומלץ לקבוע משימות עמוקות לשעות האלו.", type: "tip" },
              { text: "השלמת 3 משימות צבעוניות היום. הוספת תגים עוזרת ל-AI לסווג טוב יותר את הלוז שלך.", type: "info" },
              { text: "זמן העבודה הממוצע שלך על משימות Dev ירד ב-12%. עבודה מצוינת!", type: "success" },
            ].map((rec, i) => (
              <div key={i} className="bg-[#09090b]/50 p-4 rounded-2xl border border-white/5 flex gap-4">
                <div className={`w-1.5 rounded-full h-auto ${rec.type === 'tip' ? 'bg-amber-500' : rec.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
