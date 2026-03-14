/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square, Globe, ChevronDown } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "../config/languages";
import { languageDetector } from "../services/languageDetector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type VoiceStatus = "idle" | "listening" | "processing" | "done" | "error" | "unsupported";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  selectedLanguage?: LanguageCode;
  onLanguageChange?: (language: LanguageCode) => void;
}

// Map language codes to Web Speech API language codes
const LANGUAGE_TO_SPEECH_API_CODE: Record<LanguageCode, string> = {
  en: "en-US",
  hi: "hi-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

const BAR_COUNT = 24;
const MAX_DISPLAY_LENGTH = 100;

function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export default function VoiceInput({
  onTranscript,
  selectedLanguage = "en",
  onLanguageChange,
}: VoiceInputProps) {
  const [status, setStatus] = useState<VoiceStatus>(() =>
    isSpeechRecognitionSupported() ? "idle" : "unsupported"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode>(selectedLanguage);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTranscriptRef = useRef("");

  // Sync selected language from parent when it changes
  useEffect(() => {
    setDetectedLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const stopVisualization = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    barRefs.current.forEach((bar) => {
      if (bar) bar.style.height = "4px";
    });
  }, []);

  const startVisualization = useCallback(
    (stream: MediaStream) => {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = audioContext;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const step = Math.max(1, Math.floor(dataArray.length / BAR_COUNT));

        const animate = () => {
          analyser.getByteFrequencyData(dataArray);
          barRefs.current.forEach((bar, i) => {
            if (bar) {
              const value = dataArray[i * step] ?? 0;
              bar.style.height = `${4 + (value / 255) * 44}px`;
            }
          });
          animFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
      } catch {
        // Visualization failed gracefully — recording still works
      }
    },
    []
  );

  const cleanup = useCallback(() => {
    stopVisualization();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopVisualization]);

  const handleStop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    cleanup();
  }, [cleanup]);

  const handleStart = useCallback(async () => {
    setStatus("listening");
    setErrorMsg("");
    setLiveTranscript("");
    finalTranscriptRef.current = "";

    // Request microphone for the audio visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startVisualization(stream);
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatus("error");
        setErrorMsg(
          "Microphone permission denied. Please allow microphone access in your browser settings and try again."
        );
        return;
      }
      // Other getUserMedia errors — continue without visualization
    }

    // Start Web Speech API
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setStatus("unsupported");
      cleanup();
      return;
    }

    const recognition = new SR();
    recognition.lang = LANGUAGE_TO_SPEECH_API_CODE[selectedLanguage];
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + " ";
          // Detect language from transcription if different from selected
          const detectedLang = languageDetector(event.results[i][0].transcript);
          if (detectedLang && detectedLang !== selectedLanguage) {
            setDetectedLanguage(detectedLang);
            // Optionally update parent component's selected language
            if (onLanguageChange) {
              onLanguageChange(detectedLang);
            }
          }
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event: any) => {
      cleanup();
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setStatus("error");
        setErrorMsg(
          "Microphone permission denied. Please allow microphone access and try again."
        );
      } else if (event.error === "no-speech") {
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg(`Voice recognition error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      cleanup();
      const finalText = finalTranscriptRef.current.trim();
      setLiveTranscript(finalText);
      if (finalText) {
        setStatus("done");
        onTranscript(finalText);
      } else {
        setStatus("idle");
      }
    };

    recognition.start();
  }, [cleanup, startVisualization, onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      cleanup();
    };
  }, [cleanup]);

  if (status === "unsupported") {
    return (
      <div className="p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <MicOff className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Voice Input Unavailable</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Your browser does not support the Web Speech API. Please use Chrome or Edge for
          voice input, or switch to Text, Screenshot, or URL.
        </p>
      </div>
    );
  }

  const statusText: Record<VoiceStatus, string> = {
    idle: `Click Start to begin voice input - Speaking ${LANGUAGES[selectedLanguage].nativeName}`,
    listening: `🔴 Listening in ${LANGUAGES[selectedLanguage].nativeName}… speak now`,
    processing: "Processing…",
    done: `Done! Click Start to record again in ${LANGUAGES[selectedLanguage].nativeName}`,
    error: "",
    unsupported: "",
  };

  // Get language-specific color for visualization bars
  const getLanguageColor = (lang: LanguageCode): string => {
    const colorMap: Record<LanguageCode, string> = {
      en: "hsl(200, 100%, 50%)",   // Blue
      hi: "hsl(0, 100%, 50%)",     // Red
      bn: "hsl(280, 100%, 50%)",   // Purple
      ta: "hsl(40, 100%, 50%)",    // Orange
      te: "hsl(120, 100%, 40%)",   // Green
      mr: "hsl(340, 100%, 50%)",   // Pink
      gu: "hsl(60, 100%, 50%)",    // Yellow
      kn: "hsl(180, 100%, 50%)",   // Cyan
      ml: "hsl(20, 100%, 50%)",    // Dark Orange
      pa: "hsl(300, 100%, 50%)",   // Magenta
    };
    return colorMap[lang] || "hsl(var(--primary))";
  };

  const currentLanguageColor = getLanguageColor(selectedLanguage);

  const isListening = status === "listening";

  return (
    <div className="p-5 flex flex-col items-center gap-4">
      {/* Language Selector */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg glass-panel-alt border border-warn-yellow/40 glow-yellow">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-warn-yellow" />
          <span className="text-xs font-medium text-foreground">{LANGUAGES[selectedLanguage].nativeName}</span>
          {detectedLanguage !== selectedLanguage && (
            <span className="text-xs text-warn-yellow bg-warn-yellow/15 border border-warn-yellow/35 px-2 py-0.5 rounded">
              Detected: {LANGUAGES[detectedLanguage].nativeName}
            </span>
          )}
        </div>
        
        <DropdownMenu open={showLanguageMenu} onOpenChange={setShowLanguageMenu}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded border border-white/20 text-muted-foreground hover:text-foreground hover:border-white/40 hover:bg-white/5 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-[#101a2a]/95 border border-white/25 text-foreground backdrop-blur-xl">
            {(Object.entries(LANGUAGES) as [LanguageCode, typeof LANGUAGES[LanguageCode]][]).map(
              ([langCode, langConfig]) => (
                <DropdownMenuItem
                  key={langCode}
                  onClick={() => {
                    if (onLanguageChange) {
                      onLanguageChange(langCode);
                    }
                    setDetectedLanguage(langCode);
                    setShowLanguageMenu(false);
                  }}
                  className={selectedLanguage === langCode ? "bg-primary/15 border border-cyber-cyan/35" : "hover:bg-white/10"}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{langConfig.name}</div>
                      <div className="text-xs text-muted-foreground">{langConfig.nativeName}</div>
                    </div>
                    {selectedLanguage === langCode && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Audio visualizer bars */}
      <div
        aria-hidden="true"
        className="flex items-end justify-center gap-1"
        style={{ height: "52px" }}
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="w-1.5 rounded-full transition-colors duration-300"
            style={{
              height: "4px",
              backgroundColor: isListening
                ? currentLanguageColor
                : `${currentLanguageColor}40`, // Add transparency when not listening
            }}
          />
        ))}
      </div>

      {/* Status / live transcript */}
      <div className="text-center min-h-[2.5rem]">
        {statusText[status] && (
          <p className="text-xs text-muted-foreground">{statusText[status]}</p>
        )}
        {(isListening || status === "done") && liveTranscript && (
          <p className="mt-1 text-sm text-foreground/70 italic line-clamp-2">
            "{liveTranscript.length > MAX_DISPLAY_LENGTH
              ? liveTranscript.substring(0, MAX_DISPLAY_LENGTH) + "…"
              : liveTranscript}"
          </p>
        )}
        {isListening && (
          <p className="mt-1 text-xs text-cyber-cyan/80 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Recording in {LANGUAGES[selectedLanguage].nativeName}
          </p>
        )}
      </div>

      {/* Permission / recognition error */}
      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg bg-trust-misinformation/10 border border-trust-misinformation/25 p-3 max-w-xs">
          <MicOff className="w-4 h-4 text-trust-misinformation mt-0.5 shrink-0" />
          <p className="text-xs text-trust-misinformation">{errorMsg}</p>
        </div>
      )}

      {/* Start / Stop button */}
      <div className="flex items-center gap-3">
        {isListening ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger-red/40 bg-danger-red/20 text-danger-red font-medium text-sm glow-danger hover:opacity-95 transition-opacity"
          >
            <Square className="w-4 h-4 fill-current" /> Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={status === "processing"}
            className="flex items-center gap-2 px-5 py-2 rounded-lg neon-button border border-cyber-cyan/40 text-cyber-cyan font-medium text-sm shadow-glow-md hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Mic className="w-4 h-4" />
            {status === "done" ? "Record Again" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}
