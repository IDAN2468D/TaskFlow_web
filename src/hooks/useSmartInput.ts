import { useState, useEffect, useRef } from "react";
import { decomposeTaskWithAI } from "@/actions/aiActions";
import { useRouter } from "next/navigation";

export const useSmartInput = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "he-IL"; 

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsVoiceInput(true);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      setPrompt(""); 
      setIsVoiceInput(false);
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      await decomposeTaskWithAI(prompt);
      setPrompt("");
      setIsVoiceInput(false);
      router.refresh(); 
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    loading,
    isListening,
    error,
    setError,
    toggleListening,
    handleSubmit,
    isVoiceInput
  };
};
