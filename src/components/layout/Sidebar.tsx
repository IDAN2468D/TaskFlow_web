"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Timer, User, Lightbulb, Zap, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { logoutUser } from "@/actions/authActions";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "בית", href: "/", icon: Home },
  { name: "עוזר AI", href: "/ai", icon: Bot },
  { name: "רעיונות", href: "/ideas", icon: Lightbulb },
  { name: "ריכוז", href: "/focus", icon: Timer },
  { name: "אנליטיקה", href: "/analytics", icon: BarChart3 },
  { name: "פרופיל", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/bridge/auth/profile');
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch sidebar profile:", err);
      }
    }
    fetchProfile();
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#18181b] border-l border-[#27272a] flex flex-col h-screen sticky top-0 shadow-2xl z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
          <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
        </div>
        <span className="text-2xl font-black text-white tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"}`} />
              <span className="font-bold text-[15px] relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <Link 
          href="/profile" 
          className="flex flex-row-reverse items-center gap-3 p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group"
        >
          {userData?.avatar ? (
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 grayscale-[20%] group-hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
          )}
          <div className="flex-1 overflow-hidden text-right">
            <p className="text-sm font-black text-white truncate group-hover:text-indigo-300 transition-colors">
              {userData?.name || "אסטרטג"}
            </p>
            <div className="flex flex-row-reverse items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">מחובר</p>
            </div>
          </div>
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          <span>התנתקות</span>
        </button>
      </div>
    </aside>
  );
}
