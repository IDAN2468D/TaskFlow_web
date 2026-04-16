import React from 'react';
import { 
  User as UserIcon, 
  Mail, 
  ChevronLeft, 
  ShieldCheck, 
  Save, 
  Fingerprint,
  Camera,
  Star,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Skill from '@/models/Skill';
import { getUserIdFromToken } from '@/lib/authHelper';
import UserSkillsManager from '@/components/users/UserSkillsManager';
import { redirect } from 'next/navigation';

export default async function AccountUpgradePage() {
  await dbConnect();
  const userId = await getUserIdFromToken();
  
  if (!userId) {
    redirect('/auth');
  }

  const user = await User.findById(userId).populate('skills');
  const allAvailableSkills = await Skill.find({}).sort({ name: 1 });

  // Map to plain objects for client components
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainSkills = JSON.parse(JSON.stringify(allAvailableSkills));

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 p-6 md:p-12 overflow-x-hidden">
      {/* High-Fidelity Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex flex-row-reverse items-start justify-between mb-16">
           <div className="text-right">
             <div className="flex flex-row-reverse items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Profile v4.2.0</span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
             </div>
             <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">הגדרות חשבון</h1>
             <p className="text-slate-400 font-medium text-lg">ניהול הזהות הדיגיטלית שלך ב-TaskFlow AI&rlm;</p>
           </div>
           <Link href="/profile" className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md">
             <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-white rotate-180" />
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left Sidebar: Profile Summary */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#18181b]/40 border border-white/5 rounded-[40px] p-8 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="relative mb-6 inline-block">
                    <div className="w-32 h-32 bg-indigo-500/20 rounded-[40px] border-4 border-indigo-500/40 flex items-center justify-center p-1 relative z-10">
                       <UserIcon size={64} className="text-indigo-400" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-[#09090b] text-white hover:scale-110 transition-transform shadow-xl">
                       <Camera size={18} />
                    </button>
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                 </div>

                 <h2 className="text-2xl font-black text-white">{plainUser.name}</h2>
                 <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mt-1">{plainUser.plan}</p>
                 
                 <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex flex-row-reverse items-center justify-between text-xs px-2">
                       <span className="text-slate-500 font-bold">מצב חשבון</span>
                       <span className="text-emerald-400 font-black flex items-center gap-1">פעיל <ShieldCheck size={12} /></span>
                    </div>
                    <div className="flex flex-row-reverse items-center justify-between text-xs px-2">
                       <span className="text-slate-500 font-bold">הצטרפות</span>
                       <span className="text-white font-black">אפריל 2024</span>
                    </div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-[#18181b]/60 to-[#18181b]/20 border border-white/5 rounded-[40px] p-8">
                 <div className="flex flex-row-reverse items-center gap-3 mb-6">
                    <Star className="text-amber-400" size={20} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">הטבות Premium</h3>
                 </div>
                 <ul className="space-y-4 text-right">
                    {['סנכרון ענן ללא הגבלה', 'פירוק משימה ב-Deep Mode', 'גישה מוקדמת לתכונות AI'].map((feat, i) => (
                      <li key={i} className="text-xs text-slate-400 font-medium flex flex-row-reverse items-center gap-3">
                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                         {feat}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* Right Main: Form & Skills */}
           <div className="lg:col-span-8 space-y-8">
              {/* Skills Manager integrated here */}
              <UserSkillsManager 
                currentSkills={plainUser.skills || []} 
                allAvailableSkills={plainSkills} 
              />

              <section className="bg-[#18181b]/60 backdrop-blur-2xl border border-white/5 rounded-[48px] p-10 shadow-2xl">
                 <h3 className="text-xl font-black text-white mb-10 text-right flex flex-row-reverse items-center gap-3">
                    <Fingerprint className="text-indigo-500" />
                    פרטי זיהוי אסטרטגיים
                 </h3>
                 
                 <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3 text-right">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">שם מלא</label>
                       <div className="relative group">
                          <input 
                             type="text" 
                             defaultValue={plainUser.name}
                             readOnly
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-right outline-none cursor-not-allowed opacity-50 font-bold"
                          />
                          <UserIcon className="absolute left-6 top-4 text-slate-600" size={20} />
                       </div>
                    </div>

                    <div className="space-y-3 text-right">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">כתובת אימייל</label>
                       <div className="relative group">
                          <input 
                             type="email" 
                             defaultValue={plainUser.email}
                             readOnly
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-right outline-none cursor-not-allowed opacity-50 font-bold"
                          />
                          <Mail className="absolute left-6 top-4 text-slate-600" size={20} />
                       </div>
                       <p className="text-[10px] text-slate-600 font-bold mt-2">האימייל משמש לסנכרון בין כלל מכשירי המערכת&rlm;.</p>
                    </div>

                    <div className="pt-6">
                       <button 
                         disabled
                         className="w-full bg-slate-800 text-slate-500 font-black py-5 rounded-3xl cursor-not-allowed flex items-center justify-center gap-3 transition-all"
                       >
                         <Save size={20} />
                         <span>עריכת פרטים (בקרוב)</span>
                       </button>
                    </div>
                 </div>
              </section>

              <section className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-8 flex flex-row-reverse items-center justify-between group hover:bg-red-500/10 transition-all">
                 <div className="text-right">
                    <h4 className="text-red-400 font-black text-lg mb-1">אזור רגיש</h4>
                    <p className="text-red-400/60 text-xs font-medium">מחיקת החשבון והנתונים האסטרטגיים לצמיתות&rlm;.</p>
                 </div>
                 <button className="bg-white/5 border border-red-500/20 text-red-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Delete Account
                 </button>
              </section>
           </div>
        </div>
      </div>
    </main>
  );
}
