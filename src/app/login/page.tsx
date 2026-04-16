"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowLeft, Loader2, Smartphone, CheckCircle2 } from "lucide-react";
import { loginUser, initiatePairing, checkPairingStatus, loginWithGoogleAction } from "@/actions/authActions";
import GoogleLogin from "@/components/auth/GoogleLogin";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPairingMode, setIsPairingMode] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pairingStatus, setPairingStatus] = useState<'pending' | 'authorized' | 'expired'>('pending');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleStartPairing = async () => {
    setIsPairingMode(true);
    const res = await initiatePairing();
    if (res.success) {
      setPairingCode(res.code);
      setPairingStatus('pending');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPairingMode && pairingCode && pairingStatus === 'pending') {
      interval = setInterval(async () => {
        const res = await checkPairingStatus(pairingCode);
        if (res.status === 'authorized') {
          setPairingStatus('authorized');
          clearInterval(interval);
          setTimeout(() => router.push('/'), 1500);
        } else if (res.status === 'expired') {
          setPairingStatus('expired');
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPairingMode, pairingCode, pairingStatus, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("משהו השתבש, נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 bg-indigo-500/15 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-indigo-500/30 mb-6"
          >
            <Smartphone className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">ברוך שובך</h1>
          <p className="text-slate-400 font-medium">הכנס פרטים או סנכרן עם המובייל&rlm;</p>
        </div>

        <div className="bg-[#18181b]/50 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl">
          <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setIsPairingMode(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isPairingMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              התחברות
            </button>
            <button 
              onClick={handleStartPairing}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isPairingMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              סנכרון מובייל
            </button>
          </div>

          {!isPairingMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 mr-2">אימייל</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#09090b]/50 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 mr-2">סיסמה</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#09090b]/50 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>התחברות</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              {pairingStatus === 'authorized' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">הסנכרון הושלם!</h3>
                  <p className="text-slate-400">מיד תועבר ללוח הבקרה...</p>
                </motion.div>
              ) : pairingStatus === 'expired' ? (
                <div className="py-8">
                  <p className="text-red-400 mb-4 font-bold">הקוד פג תוקף</p>
                  <button 
                    onClick={handleStartPairing}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    נסה שוב
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-400 text-sm font-medium">פתח את האפליקציה במובייל והזן את הקוד:</p>
                    <div className="bg-black/40 border border-white/5 rounded-3xl p-10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-5xl font-black text-white tracking-[0.2em]">{pairingCode || '------'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">ממתין לאישור מהמכשיר...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#18181b] px-4 text-slate-500 font-bold">או באמצעות</span>
            </div>
          </div>

          <GoogleLogin />

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <span className="text-slate-500 font-medium">אין לך חשבון? </span>
            <Link href="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              להרשמה מהירה
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-slate-600 text-sm font-bold hover:text-slate-400 transition-colors">
            חזרה לדף הבית
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
