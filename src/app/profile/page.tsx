import React from 'react';
import { 
  User, 
  Settings, 
  ChevronLeft, 
  Bell, 
  Palette, 
  CloudSync,
  BrainCircuit,
  Lock,
  Star,
  Zap,
  Shield,
  History,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAIUsageCountAction } from "@/actions/aiAnalyticsActions";
import { getUserIdFromToken } from "@/lib/authHelper";
import UserProfile from "@/models/User";
import Link from 'next/link';

export default async function ProfilePage() {
  await dbConnect();
  const userId = await getUserIdFromToken();
  const user = await UserProfile.findById(userId).populate('skills.skillId').select('name email avatar skills');
  
  const activeTasksCount = await Task.countDocuments({ userId, status: { $ne: "Done" } });
  const aiActionsCount = await getAIUsageCountAction();
  
  // Calculate total XP and major skill
  const totalXP = user?.skills?.reduce((acc: number, s: any) => acc + s.xp, 0) || 0;
  const majorSkill = user?.skills?.reduce((prev: any, current: any) => (prev.xp > current.xp) ? prev : current, { skillId: { name: 'אסטרטג' } });

  const profileMenuItems = [
    { 
      title: 'ניהול חשבון', 
      sections: [
        { id: 'account', icon: User, title: 'פרטי זיהוי', desc: 'שם, אימייל ופרטי פרופיל אסטרטגיים', version: 'v4.2', color: 'indigo' },
        { id: 'notifications', icon: Bell, title: 'התראות ותקשורת', desc: 'ניהול זרימת המידע והתראות AI', version: 'v2.1', color: 'amber' }
      ]
    },
    { 
      title: 'מערכות ליבה וסנכרון', 
      sections: [
        { id: 'sync', icon: CloudSync, title: 'סנכרון ענן AI', desc: 'ניהול רשת הנתונים וסנכרון מכשירים', version: 'v2.4', color: 'blue' },
        { id: 'settings', icon: BrainCircuit, title: 'הגדרות תשתית', desc: 'קונפיגורציה טכנית וניהול ארכיון', version: 'v5.1', color: 'emerald' }
      ]
    },
    { 
      title: 'אסתטיקה ואבטחה', 
      sections: [
        { id: 'theme', icon: Palette, title: 'מראה ועיצוב', desc: 'התאמה אישית של ממשק המשתמש', version: 'v4.0', color: 'fuchsia' },
        { id: 'security', icon: Lock, title: 'מרכז אבטחה', desc: 'הצפנה מקצה לקצה וניהול מפתחות', version: 'v3.0', color: 'red' }
      ]
    },
    { 
      title: 'בינה מלאכותית ואסטרטגיה', 
      sections: [
        { id: 'ai', icon: BrainCircuit, title: 'עוזר אישי AI', desc: 'התאמת אישיות הסוכן וניתוח ביצועים', version: 'v6.0', color: 'indigo' }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-row-reverse items-start justify-between mb-16">
          <div className="text-right">
            <div className="flex flex-row-reverse items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Profile Ecosystem v5.0</span>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">ניהול פרופיל ואסטרטגיה</h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl ml-auto text-right">מרכז הבקרה לניהול הזהות הדיגיטלית והתובנות שלך&rlm;</p>
          </div>
          <Link href="/" className="bg-white/5 p-5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-xl hover:scale-110 active:scale-95 shadow-2xl">
            <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180 transition-transform" />
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Profile Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               
               <div className="flex flex-col items-center relative z-10">
                  <div className="w-40 h-40 rounded-[48px] bg-[#09090b] border-4 border-white/5 p-1 mb-6 shadow-2xl relative">
                     {user?.avatar ? (
                       <img 
                         src={user.avatar} 
                         alt={user.name} 
                         referrerPolicy="no-referrer"
                         className="w-full h-full rounded-[44px] object-cover"
                       />
                     ) : (
                       <div className="w-full h-full rounded-[44px] bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/30">
                          <User className="w-16 h-16 text-indigo-400" size={64} />
                       </div>
                     )}
                     <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-[20px] border-4 border-[#18181b] flex items-center justify-center shadow-xl">
                        <Star className="text-white" size={18} />
                     </div>
                  </div>

                  <h2 className="text-3xl font-black text-white mb-1">{user?.name || 'אסטרטג'}</h2>
                  <p className="text-slate-500 font-bold text-sm mb-6 pb-6 border-b border-white/5 w-full text-center tracking-wide">{user?.email}</p>

                  <div className="grid grid-cols-2 gap-3 w-full mb-3">
                     <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Active Tasks</p>
                        <p className="text-2xl font-black text-white">{activeTasksCount}</p>
                     </div>
                     <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Total XP</p>
                        <p className="text-2xl font-black text-indigo-400">{totalXP}</p>
                     </div>
                  </div>

                  <div className="w-full bg-white/5 p-5 rounded-[28px] border border-white/5 mb-4">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-indigo-400 font-black text-xs">{(totalXP % 1000) / 10}%</span>
                        <span className="text-slate-200 font-bold text-xs">{majorSkill?.skillId?.name || 'אסטרטג AI'}</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                          style={{ width: `${(totalXP % 1000) / 10}%` }}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-white/5 rounded-[40px] p-8 flex flex-row-reverse items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all">
               <div className="text-right">
                  <h3 className="text-white font-black text-lg">M-Cloud Premium</h3>
                  <p className="text-xs text-slate-500 font-medium">המנהיגות הדיגיטלית שלך מאובטחת&rlm;.</p>
               </div>
               <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/40">
                  <ShieldCheck className="text-emerald-500" size={24} />
               </div>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-8 space-y-10">
            {profileMenuItems.map((group, gIdx) => (
              <section key={gIdx} className="space-y-4">
                <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[5px] mr-6 text-right">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.sections.map((item) => (
                    <Link
                      key={item.id}
                      href={`/profile/${item.id}`}
                      className="group p-8 bg-[#18181b]/30 backdrop-blur-xl border border-white/5 rounded-[40px] hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl relative overflow-hidden flex flex-row-reverse items-center justify-between"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-white transition-all transform group-hover:-translate-x-1" />
                      
                      <div className="flex flex-row-reverse items-center gap-6">
                        <div className="text-right">
                          <h2 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </h2>
                          <p className="text-slate-500 font-medium text-[11px] leading-relaxed max-w-[160px]">
                            {item.desc}
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-inner group-hover:border-indigo-500/50">
                          <item.icon className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={24} />
                        </div>
                      </div>
                      
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-[3px]">{item.version}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            <div className="pt-8 flex flex-row-reverse justify-between items-center px-4 border-t border-white/5">
               <button className="flex flex-row-reverse items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest hover:text-red-400 transition-colors">
                  <LogOut size={16} /> יציאה מהמערכת
               </button>
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-[4px]">System Integrity v5.0.0-Stable</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
