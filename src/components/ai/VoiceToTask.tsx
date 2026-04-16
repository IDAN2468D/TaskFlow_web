'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Wand2 } from 'lucide-react';
import { parseVoiceToTask } from '@/lib/actions/ai.actions';
import { toast } from 'sonner';

/**
 * VoiceToTask Component
 * Premium voice recording interface with real-time feedback and glassmorphism.
 */
export default function VoiceToTask() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleVoiceUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('הקלטה פעילה...&rlm;', { icon: <Mic className="w-4 h-4 text-indigo-500" /> });
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('לא ניתן לגשת למיקרופון&rlm;');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleVoiceUpload = async (blob: Blob) => {
    setIsProcessing(true);
    
    // Convert blob to base64 for Server Action (Next.js payloads)
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      
      try {
        const result = await parseVoiceToTask(base64Audio);
        if (result.success) {
          toast.success('המשימה פוענחה בהצלחה!&rlm;', {
            description: `כותרת: ${result.task?.title || 'משימה חדשה'}`
          });
        } else {
          toast.error('פיענוח נכשל&rlm;', { description: result.error });
        }
      } catch (error) {
        toast.error('שגיאה בעיבוד הקולי&rlm;');
      } finally {
        setIsProcessing(false);
      }
    };
  };

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-500" />
            סיוע קולי AI&rlm;
          </h3>
          <p className="text-zinc-400 text-sm mt-1">דבר אליי, אני אהפוך את זה למשימה&rlm;</p>
        </div>
        {isRecording && (
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 h-4 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${
          isRecording
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isRecording ? (
          <>
            <Square className="w-6 h-6 fill-current" />
            עצור הקלטה&rlm;
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            התחל להקליט&rlm;
          </>
        )}
      </button>

      {isProcessing && (
        <div className="mt-4 flex items-center gap-3 text-indigo-400 animate-pulse">
          <Wand2 className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">מנתח את גלי הקול שלך...&rlm;</span>
        </div>
      )}
    </div>
  );
}
