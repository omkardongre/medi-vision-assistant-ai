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
  const [hasError, setHasError] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      console.log("Speech hook called with text:", text);
      console.log("Speech supported:", isSupported);
      
      if (!isSupported || !text || !text.trim()) {
        console.log("Speech not supported or no text provided");
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Wait for voices to be loaded
      const speakText = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.8;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.lang = options.lang || "en-US";

        utterance.onstart = () => {
          console.log("Speech started");
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          console.log("Speech ended");
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error("Speech error:", event);
          setIsSpeaking(false);
          setHasError(true);
          
          // Try fallback approach
          if (event.error === 'synthesis-failed') {
            console.log("Trying fallback speech synthesis...");
            setTimeout(() => {
              try {
                speechSynthesis.cancel();
                const fallbackUtterance = new SpeechSynthesisUtterance(text);
                fallbackUtterance.rate = 0.7;
                fallbackUtterance.pitch = 1;
                fallbackUtterance.volume = 1;
                fallbackUtterance.lang = "en-US";
                
                fallbackUtterance.onstart = () => {
                  setIsSpeaking(true);
                  setHasError(false);
                };
                fallbackUtterance.onend = () => setIsSpeaking(false);
                fallbackUtterance.onerror = () => {
                  console.error("Fallback speech also failed");
                  setIsSpeaking(false);
                  setHasError(true);
                };
                
                speechSynthesis.speak(fallbackUtterance);
              } catch (fallbackError) {
                console.error("Fallback speech error:", fallbackError);
                setIsSpeaking(false);
                setHasError(true);
              }
            }, 100);
          }
        };

        utteranceRef.current = utterance;
        console.log("Starting speech synthesis...");
        speechSynthesis.speak(utterance);
      };

      // Check if voices are loaded, if not wait for them
      if (speechSynthesis.getVoices().length === 0) {
        console.log("Waiting for voices to load...");
        speechSynthesis.onvoiceschanged = () => {
          console.log("Voices loaded, starting speech...");
          speakText();
        };
      } else {
        speakText();
      }
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
    hasError,
  };
}
