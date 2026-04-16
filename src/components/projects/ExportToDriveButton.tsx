"use client";

import React, { useState } from 'react';
import { exportPrdToGoogleDoc } from '@/actions/driveActions';
import { SiGoogledrive } from 'react-icons/si'; // I'll use a better icon if possible, but Lucide is already there
import { FileText, Loader2, Check } from 'lucide-react';

interface ExportToDriveButtonProps {
  projectId: string;
}

export default function ExportToDriveButton({ projectId }: ExportToDriveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);
  const [docLink, setDocLink] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      // 1. Get access token from Google
      // We use the 'google.accounts.oauth2.initTokenClient' for Drive access
      // @ts-ignore
      const client = google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            // 2. Call server action with token
            const result = await exportPrdToGoogleDoc(projectId, tokenResponse.access_token);
            if (result.success) {
              setExported(true);
              setDocLink(result.webViewLink || null);
            } else {
              alert("ייצוא נכשל: " + result.error);
            }
          }
          setLoading(false);
        },
      });

      client.requestAccessToken();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (exported && docLink) {
    return (
      <a 
        href={docLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
      >
        <Check className="w-4 h-4" />
        פתח ב-Google Docs
      </a>
    );
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-[#18181b] hover:bg-indigo-600/10 text-slate-300 hover:text-indigo-400 border border-white/5 hover:border-indigo-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 group"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
      )}
      ייצוא ל-Google Drive
    </button>
  );
}
