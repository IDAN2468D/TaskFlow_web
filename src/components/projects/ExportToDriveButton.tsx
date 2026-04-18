"use client";

import React, { useState } from 'react';
import { exportPrdToGoogleDoc } from '@/actions/driveActions';
import { FileText, Loader2, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportToDriveButtonProps {
  projectId: string;
}

export default function ExportToDriveButton({ projectId }: ExportToDriveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'exported'>('idle');
  const [docLink, setDocLink] = useState<string | null>(null);

  const handleExport = async () => {
    setStatus('loading');
    try {
      // @ts-expect-error: Global google object is not defined in TS
      const client = google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            const result = await exportPrdToGoogleDoc(projectId, tokenResponse.access_token);
            if (result.success) {
              setStatus('exported');
              setDocLink(result.webViewLink || null);
            } else {
              alert("ייצוא נכשל: " + result.error);
              setStatus('idle');
            }
          } else {
            setStatus('idle');
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        {status === 'exported' && docLink ? (
          <motion.a 
            key="link"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            href={docLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 group"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            פתח מסמך
          </motion.a>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleExport}
            disabled={status === 'loading'}
            className="relative flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 overflow-hidden group shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            {status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            )}
            <span className="relative z-10 shrink-0">
              {status === 'loading' ? 'מייצא...' : 'יצוא ל-Drive'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

