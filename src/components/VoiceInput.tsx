/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square } from "lucide-react";

type VoiceStatus = "idle" | "listening" | "processing" | "done" | "error" | "unsupported";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

const BAR_COUNT = 24;
const MAX_DISPLAY_LENGTH = 100;

function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [status, setStatus] = useState<VoiceStatus>(() =>
    isSpeechRecognitionSupported() ? "idle" : "unsupported"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTranscriptRef = useRef("");

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
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + " ";
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
    idle: "Click Start to begin voice input",
    listening: "🔴 Listening… speak now",
    processing: "Processing…",
    done: "Done! Click Start to record again.",
    error: "",
    unsupported: "",
  };

  const isListening = status === "listening";

  return (
    <div className="p-5 flex flex-col items-center gap-4">
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
                ? "hsl(var(--primary))"
                : "hsl(var(--muted-foreground) / 0.3)",
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-trust-misinformation text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Square className="w-4 h-4 fill-current" /> Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={status === "processing"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Mic className="w-4 h-4" />
            {status === "done" ? "Record Again" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}
