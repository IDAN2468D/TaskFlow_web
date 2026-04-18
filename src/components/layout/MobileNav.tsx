"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Timer, Lightbulb, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "בית", href: "/", icon: Home },
  { name: "AI", href: "/ai", icon: Bot },
  { name: "רעיונות", href: "/ideas", icon: Lightbulb },
  { name: "ריכוז", href: "/focus", icon: Timer },
  { name: "אנליטיקה", href: "/analytics", icon: BarChart3 },
];

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface-mid/80 backdrop-blur-2xl border-t border-white/10 px-6 py-3 pb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center gap-1 group"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? "bg-indigo-500/10 text-indigo-400" : "text-slate-500"
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                isActive ? "text-indigo-400" : "text-slate-500"
              }`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-active"
                  className="absolute -top-1 w-1 h-1 bg-indigo-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
        <Link 
          href="/profile"
          className={`relative flex flex-col items-center gap-1 group ${
            pathname === "/profile" ? "text-indigo-400" : "text-slate-500"
          }`}
        >
          <div className={`p-2 rounded-xl transition-all ${
            pathname === "/profile" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-500"
          }`}>
            <User className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">פרופיל</span>
        </Link>
      </div>
    </nav>
  );
}
