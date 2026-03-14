import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Chrome,
  Mic,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import logo from "@/assets/trustvault-logo.png";

const apiCards = [
  {
    name: "Discovery API",
    hint: "Find reliable source networks",
    tone: "bg-sky-100/80 text-sky-900",
  },
  {
    name: "Extraction API",
    hint: "Parse claim + evidence blocks",
    tone: "bg-rose-100/80 text-rose-900",
  },
  {
    name: "Answer API",
    hint: "Return factual confidence score",
    tone: "bg-cyan-100/80 text-cyan-900",
  },
  {
    name: "Agent API",
    hint: "Autonomous misinformation checks",
    tone: "bg-amber-100/80 text-amber-900",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-gradient min-h-screen overflow-hidden px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-cyber-cyan/30 glass-panel shadow-[0_26px_70px_-28px_rgba(0,200,255,0.3)]">
        <div className="absolute pointer-events-none inset-0">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-cyber-blue/15 blur-3xl" />
          <div className="absolute right-10 top-24 h-44 w-44 rounded-full bg-cyber-cyan/10 blur-3xl" />
          <div className="absolute bottom-6 left-1/3 h-28 w-44 rounded-full bg-cyber-purple/10 blur-3xl" />
        </div>

        <header className="relative px-4 pt-4 sm:px-8 sm:pt-7">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-lg border border-mint border-opacity-40 glass-panel px-4 shadow-glow-md">
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="TruthShade"
                className="h-7 w-7 rounded-md object-cover border border-mint border-opacity-40"
              />
              <span className="text-[15px] font-bold tracking-tight text-gradient-cyber">
                TruthShade
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/learn")}
                className="button-ghost rounded-full px-4 py-2 text-[12px] font-semibold flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </button>
              <button
                onClick={() => navigate("/analyze")}
                className="neon-button rounded-full px-5 py-2 text-[12px] font-semibold"
              >
                Get started
              </button>
            </div>
          </div>
        </header>

        <main className="relative px-5 pb-6 pt-12 sm:px-10 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center fade-in"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-mint border-opacity-40 glass-panel px-4 py-1 text-xs font-medium text-mint">
              <Sparkles className="h-3.5 w-3.5 text-mint" />
              Enterprise-grade misinformation detection
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] text-gradient-cyber sm:text-6xl">
              Verify online narratives
              <br />
              with evidence-backed AI
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Analyze news text, website content, screenshots, and voice
              statements in seconds. Built for journalists, researchers, and
              truth-first teams.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate("/analyze")}
                className="neon-button inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-glow-lg"
              >
                Request Access
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/analyze")}
                className="button-ghost inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
              >
                Try Live Analyzer
              </button>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-12 max-w-5xl rounded-lg border border-mint border-opacity-30 glass-panel p-3 shadow-glow-lg sm:p-5"
          >
            <div className="grid gap-4 md:grid-cols-[170px_1fr]">
              <aside className="rounded-lg border border-mint border-opacity-20 glass-panel p-3">
                <div className="flex items-center gap-2 border-b border-mint border-opacity-20 pb-3">
                  <img
                    src={logo}
                    alt="TruthShade"
                    className="h-6 w-6 rounded-md object-cover border border-mint border-opacity-30"
                  />
                  <span className="text-xs font-semibold text-mint">
                    Dashboard
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="rounded-md glass-panel px-2 py-1.5 font-semibold text-mint">
                    Overview
                  </li>
                  <li className="px-2 py-1.5 hover:text-mint transition-colors">
                    Live Scan
                  </li>
                  <li className="px-2 py-1.5 hover:text-mint transition-colors">
                    Source Graph
                  </li>
                  <li className="px-2 py-1.5 hover:text-mint transition-colors">
                    API Keys
                  </li>
                </ul>
              </aside>

              <div className="rounded-lg border border-mint border-opacity-20 glass-panel p-4">
                <h3 className="text-lg font-semibold text-gradient-cyber">
                  Misinformation Intelligence Suite
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unified endpoints for claim extraction, source reliability,
                  and verdict confidence.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {apiCards.map((card) => (
                    <div
                      key={card.name}
                      className="border border-mint border-opacity-30 glass-panel rounded-lg px-3 py-3 hover-glow transition-all"
                    >
                      <p className="text-[11px] font-bold text-mint">
                        {card.name}
                      </p>
                      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                        {card.hint}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 text-[11px] sm:grid-cols-3">
                  <div className="rounded-lg border border-mint border-opacity-20 glass-panel px-3 py-2">
                    <p className="text-muted-foreground">API Key</p>
                    <p className="mt-1 font-semibold text-mint">
                      tsk_live_48h...9z
                    </p>
                  </div>
                  <div className="rounded-lg border border-mint border-opacity-20 glass-panel px-3 py-2">
                    <p className="text-muted-foreground">Checks Completed</p>
                    <p className="mt-1 font-semibold text-mint">18,402 today</p>
                  </div>
                  <div className="rounded-lg border border-mint border-opacity-20 glass-panel px-3 py-2">
                    <p className="text-muted-foreground">Accuracy Window</p>
                    <p className="mt-1 font-semibold text-ok-green">
                      97.8% verified
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-mint border-opacity-20 glass-panel p-3 text-sm text-muted-foreground">
                  Ask TruthShade: "Is this headline manipulated?" or "Summarize
                  factual confidence by source."
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: [1, 1.015, 1], y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.45,
          scale: { duration: 1.9, repeat: Infinity, ease: "easeInOut" },
        }}
        className="fixed bottom-5 left-5 z-50 w-[300px] max-w-[calc(100vw-2.5rem)] rounded-lg border border-mint border-opacity-40 glass-panel p-3.5 shadow-glow-lg ambient-drift sm:bottom-7 sm:left-8"
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mint border-opacity-40 glass-panel px-2.5 py-1 text-[10px] font-semibold text-mint">
          <Chrome className="h-3.5 w-3.5" />
          TruthShade Shield
        </div>
        <h3 className="text-base font-bold text-foreground">
          Real-Time Misinformation Scanner
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Spot fake news, edited narratives, and risky forwards on any website
          in one click.
        </p>
        <div className="mt-2.5 space-y-1.5 text-[11px] text-muted-foreground">
          <p>1. Highlights suspicious claims on the active page</p>
          <p>2. Returns verdict: True, Misleading, or Fake</p>
          <p>3. Shows fact-check sources and evidence links</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="neon-button inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold">
            <ScanSearch className="h-3.5 w-3.5" />
            Detect
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="button-ghost inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold"
          >
            <Mic className="h-3.5 w-3.5" />
            Verify
          </button>
        </div>
      </motion.div>

      {/* Educational Module CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={() => navigate("/learn")}
        className="fixed bottom-5 right-5 z-40 w-[320px] max-w-[calc(100vw-2.5rem)] cursor-pointer rounded-lg border border-mint border-opacity-40 glass-panel p-3.5 shadow-glow-lg hover-glow transition-all sm:bottom-7 sm:right-8"
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mint border-opacity-40 glass-panel px-2.5 py-1 text-[10px] font-semibold text-mint">
          <BookOpen className="h-3.5 w-3.5" />
          Educational Module
        </div>
        <h3 className="text-base font-bold text-foreground">
          Learn to Spot Misinformation
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Master the skills to identify fake news, deepfakes, fake stats, and
          more.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-mint bg-opacity-10 px-3 py-2 text-center text-[11px] font-semibold text-mint">
            6 Interactive Lessons
          </div>
          <div className="flex items-center justify-center rounded-lg bg-mint bg-opacity-10 h-10 w-10 flex-shrink-0">
            <ArrowRight className="h-4 w-4 text-mint" />
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
        TruthShade trusted detection platform
      </div>
    </div>
  );
};

export default Home;
