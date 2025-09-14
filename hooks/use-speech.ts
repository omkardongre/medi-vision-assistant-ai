"use client";

import { useState, useCallback, useRef } from "react";

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text || !text.trim()) return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || "en-US";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [isSupported, options]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
  };
}
