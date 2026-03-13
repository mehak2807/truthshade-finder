/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import VoiceInput from "@/components/VoiceInput";

// Minimal SpeechRecognition mock factory
function createMockRecognition() {
  const mock: any = {
    lang: "",
    continuous: false,
    interimResults: false,
    start: vi.fn(),
    stop: vi.fn(),
    onresult: null as any,
    onerror: null as any,
    onend: null as any,
  };
  return mock;
}

describe("VoiceInput", () => {
  let mockRecognition: ReturnType<typeof createMockRecognition>;
  const onTranscript = vi.fn();

  beforeEach(() => {
    onTranscript.mockClear();
    mockRecognition = createMockRecognition();

    // Install SpeechRecognition mock
    (window as any).SpeechRecognition = vi.fn(() => mockRecognition);
    delete (window as any).webkitSpeechRecognition;

    // Mock getUserMedia
    const mockStream = {
      getTracks: vi.fn(() => [{ stop: vi.fn() }]),
    };
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: vi.fn(() => Promise.resolve(mockStream)) },
      configurable: true,
      writable: true,
    });

    // Mock AudioContext
    (window as any).AudioContext = vi.fn(() => ({
      createAnalyser: vi.fn(() => ({
        fftSize: 0,
        frequencyBinCount: 32,
        connect: vi.fn(),
        getByteFrequencyData: vi.fn((arr: Uint8Array) => arr.fill(0)),
      })),
      createMediaStreamSource: vi.fn(() => ({ connect: vi.fn() })),
      close: vi.fn(),
    }));
  });

  afterEach(() => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
    vi.restoreAllMocks();
  });

  it("renders Start button when SpeechRecognition is supported", () => {
    render(<VoiceInput onTranscript={onTranscript} />);
    expect(screen.getByRole("button", { name: /start/i })).toBeDefined();
  });

  it("shows unsupported message when SpeechRecognition is not available", () => {
    delete (window as any).SpeechRecognition;
    render(<VoiceInput onTranscript={onTranscript} />);
    expect(screen.getByText("Voice Input Unavailable")).toBeDefined();
  });

  it("shows Stop button after clicking Start", async () => {
    render(<VoiceInput onTranscript={onTranscript} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /stop/i })).toBeDefined()
    );
  });

  it("calls onTranscript with the final transcription when recognition ends", async () => {
    render(<VoiceInput onTranscript={onTranscript} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Wait for recognition.start() to have been called
    await waitFor(() => expect(mockRecognition.start).toHaveBeenCalled());

    // Simulate a final result
    const mockSpeechResult: any = [{ transcript: "the earth is flat" }];
    mockSpeechResult.isFinal = true;
    act(() => {
      mockRecognition.onresult({
        resultIndex: 0,
        results: Object.assign([mockSpeechResult], { length: 1 }),
      });
      mockRecognition.onend();
    });

    await waitFor(() =>
      expect(onTranscript).toHaveBeenCalledWith("the earth is flat")
    );
  });

  it("shows permission-denied error when getUserMedia is rejected with NotAllowedError", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: vi.fn(() =>
          Promise.reject(Object.assign(new Error(), { name: "NotAllowedError" }))
        ),
      },
      configurable: true,
      writable: true,
    });

    render(<VoiceInput onTranscript={onTranscript} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    await waitFor(() =>
      expect(screen.getByText(/microphone permission denied/i)).toBeDefined()
    );
  });

  it("returns to idle and does not call onTranscript when no speech is detected", async () => {
    render(<VoiceInput onTranscript={onTranscript} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    await waitFor(() => expect(mockRecognition.start).toHaveBeenCalled());

    // Recognition ends without any results
    act(() => {
      mockRecognition.onend();
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /start/i })).toBeDefined()
    );
    expect(onTranscript).not.toHaveBeenCalled();
  });
});
