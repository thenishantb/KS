import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

const getLanguageCode = (lang: string): string => {
  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
  };
  return langMap[lang] || 'en-IN';
};

export function useSpeechRecognition() {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = getLanguageCode(language);

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[0][0];
          setTranscript(result.transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = () => {
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [language]);

  const startListening = () => {
    if (recognition) {
      recognition.lang = getLanguageCode(language);
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
}

// src/hooks/useSpeech.ts

// ... keep imports and useSpeechRecognition as they are ...

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text: string) => {
    if (!isSupported) return;

    // Stop any current audio before starting new
    window.speechSynthesis.cancel();
    setIsPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const pause = () => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  return { 
    speak, 
    cancel, 
    pause, 
    resume, 
    isSpeaking, 
    isPaused, 
    isSupported 
  };
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}
