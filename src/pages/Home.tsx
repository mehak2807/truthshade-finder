import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Chrome, Mic, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import logo from "@/assets/trustvault-logo.png";

const apiCards = [
  { name: "Discovery API", hint: "Find reliable source networks", tone: "bg-sky-100/80 text-sky-900" },
  { name: "Extraction API", hint: "Parse claim + evidence blocks", tone: "bg-rose-100/80 text-rose-900" },
  { name: "Answer API", hint: "Return factual confidence score", tone: "bg-cyan-100/80 text-cyan-900" },
  { name: "Agent API", hint: "Autonomous misinformation checks", tone: "bg-amber-100/80 text-amber-900" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#a8a5c2] px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl rounded-[30px] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(245,246,255,0.9)_60%,rgba(255,247,250,0.92)_100%)] shadow-[0_26px_70px_-28px_rgba(35,41,76,0.45)] backdrop-blur-md">
        <div className="absolute pointer-events-none inset-0">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-fuchsia-200/25 blur-2xl" />
          <div className="absolute right-10 top-24 h-44 w-44 rounded-full bg-sky-200/30 blur-2xl" />
          <div className="absolute bottom-6 left-1/3 h-28 w-44 rounded-full bg-emerald-200/25 blur-2xl" />
        </div>

        <header className="relative px-4 pt-4 sm:px-8 sm:pt-7">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 shadow-[0_6px_20px_-15px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="TrustVault" className="h-7 w-7 rounded-md object-cover" />
              <span className="text-[15px] font-bold tracking-tight text-slate-900">TruthShade</span>
            </div>
            <button
              onClick={() => navigate("/analyze")}
              className="rounded-full bg-slate-900 px-5 py-2 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
            >
              Get started
            </button>
          </div>
        </header>

        <main className="relative px-5 pb-6 pt-12 sm:px-10 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-1 text-xs font-medium text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              Enterprise-grade misinformation detection APIs
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] text-slate-900 sm:text-6xl">
              Verify online narratives
              <br />
              with evidence-backed AI
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Analyze news text, website content, screenshots, and voice statements in seconds.
              Built for journalists, researchers, and truth-first teams.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate("/analyze")}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_-10px_rgba(15,23,42,0.65)] transition-all hover:-translate-y-0.5"
              >
                Request Access
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/analyze")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400"
              >
                Try Live Analyzer
              </button>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.75)] sm:p-5"
          >
            <div className="grid gap-4 md:grid-cols-[170px_1fr]">
              <aside className="rounded-xl border border-slate-200 bg-slate-50/90 p-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <img src={logo} alt="TruthShade" className="h-6 w-6 rounded-md object-cover" />
                  <span className="text-xs font-semibold text-slate-700">Dashboard</span>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-500">
                  <li className="rounded-md bg-white px-2 py-1.5 font-semibold text-slate-700">Overview</li>
                  <li className="px-2 py-1.5">Live Scan</li>
                  <li className="px-2 py-1.5">Source Graph</li>
                  <li className="px-2 py-1.5">API Keys</li>
                </ul>
              </aside>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900">Misinformation Intelligence Suite</h3>
                <p className="mt-1 text-xs text-slate-500">Unified endpoints for claim extraction, source reliability, and verdict confidence.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {apiCards.map((card) => (
                    <div key={card.name} className={`rounded-xl border border-white px-3 py-3 ${card.tone}`}>
                      <p className="text-[11px] font-bold">{card.name}</p>
                      <p className="mt-2 text-[10px] leading-relaxed opacity-80">{card.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 text-[11px] sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">API Key</p>
                    <p className="mt-1 font-semibold text-slate-700">tsk_live_48h...9z</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Checks Completed</p>
                    <p className="mt-1 font-semibold text-slate-700">18,402 today</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Accuracy Window</p>
                    <p className="mt-1 font-semibold text-emerald-600">97.8% verified</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm text-slate-500">
                  Ask TruthShade: "Is this headline manipulated?" or "Summarize factual confidence by source."
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: [1, 1.015, 1], y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, scale: { duration: 1.9, repeat: Infinity, ease: "easeInOut" } }}
        className="fixed bottom-5 left-5 z-50 w-[300px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-amber-300/70 bg-white/95 p-3.5 shadow-[0_18px_38px_-20px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:bottom-7 sm:left-8"
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-900">
          <Chrome className="h-3.5 w-3.5" />
          TruthShade Misinformation Shield
        </div>
        <h3 className="text-base font-bold text-slate-900">Real-Time Misinformation Scanner</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Spot fake news, edited narratives, and risky forwards on any website in one click.
        </p>
        <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
          <p>1. Highlights suspicious claims on the active page</p>
          <p>2. Returns verdict: True, Misleading, or Fake</p>
          <p>3. Shows fact-check sources and evidence links</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-2 py-2 text-[11px] font-semibold text-white">
            <ScanSearch className="h-3.5 w-3.5" />
            Detect Misinformation
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-2 text-[11px] font-semibold text-slate-700"
          >
            <Mic className="h-3.5 w-3.5" />
            Voice Verify
          </button>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-center text-xs text-white/80">
        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
        TruthShade trusted detection platform
      </div>
    </div>
  );
};

export default Home;
