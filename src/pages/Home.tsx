import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Chrome,
  ExternalLink,
  Image as ImageIcon,
  Mic,
  Phone,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import logo from "@/assets/trustvault-logo.png";
import { UserProfileIcon } from "@/components/UserProfileIcon";

const indiaStatsCards = [
  {
    metric: "71%",
    title: "Users See Misleading Content Weekly",
    context:
      "High-volume forwarding on social platforms keeps misinformation in daily circulation.",
  },
  {
    metric: "2.5x",
    title: "Spike During High-Impact Events",
    context:
      "Election periods, disasters, and conflicts can rapidly amplify false narratives.",
  },
  {
    metric: "< 60 min",
    title: "Critical Window to Report Fraud",
    context:
      "Fast reporting to official channels significantly improves chances of intervention.",
  },
];

const indiaImageCards = [
  {
    title: "Viral Forward Chains",
    note: "Low-context screenshots and forwards often remove source attribution.",
    image:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Edited Visual Narratives",
    note: "Out-of-context images and captions are a common misinformation tactic.",
    image:
      "https://images.unsplash.com/photo-1573152143286-0c422b4d2175?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Language-Localized Claims",
    note: "False stories are often reworded into regional languages for higher spread.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  },
];

const indiaCyberHelplines = [
  {
    name: "National Cyber Crime Helpline",
    value: "1930",
    description: "Report cyber financial fraud immediately.",
    actionLabel: "Call 1930",
    href: "tel:1930",
  },
  {
    name: "Cyber Crime Reporting Portal",
    value: "cybercrime.gov.in",
    description: "File complaints online and track complaint status.",
    actionLabel: "Open Portal",
    href: "https://cybercrime.gov.in",
  },
  {
    name: "National Emergency Number",
    value: "112",
    description: "Use in urgent incidents requiring police emergency support.",
    actionLabel: "Call 112",
    href: "tel:112",
  },
];

const indiaSourceNotes = [
  {
    name: "National Crime Records Bureau (NCRB)",
    detail: "Cyber crime trend reporting and annual crime statistics.",
    href: "https://ncrb.gov.in",
  },
  {
    name: "Indian Cyber Crime Coordination Centre (I4C)",
    detail: "Official reporting workflow and 1930 response guidance.",
    href: "https://cybercrime.gov.in",
  },
  {
    name: "Ministry of Home Affairs (MHA)",
    detail: "National cyber safety advisories and response updates.",
    href: "https://www.mha.gov.in",
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
                alt="TrustVault"
                className="h-7 w-7 rounded-md object-cover border border-mint border-opacity-40"
              />
              <span className="text-[15px] font-bold tracking-tight text-gradient-cyber">
                TrustVault
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
              <UserProfileIcon />
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-12 max-w-5xl rounded-lg border border-cyber-cyan/30 glass-panel p-4 shadow-glow-lg sm:p-5"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warn-yellow" />
              <h3 className="text-lg font-semibold text-gradient-cyber">
                India Misinformation Snapshot
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Indicative awareness metrics and response contacts for
              India-focused verification workflows.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {indiaStatsCards.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-lg border border-mint border-opacity-25 glass-panel px-3 py-3"
                >
                  <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-mint border-opacity-30 bg-mint bg-opacity-10">
                    <BarChart3 className="h-4 w-4 text-mint" />
                  </div>
                  <p className="text-xl font-extrabold text-mint">
                    {stat.metric}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {stat.context}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {indiaImageCards.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-lg border border-mint border-opacity-25 glass-panel"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyber-cyan">
                      <ImageIcon className="h-3.5 w-3.5" /> Visual Pattern
                    </p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {indiaCyberHelplines.map((line) => {
                const isExternal = line.href.startsWith("http");
                return (
                  <div
                    key={line.name}
                    className="rounded-lg border border-cyber-cyan/30 glass-panel px-3 py-3"
                  >
                    <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyber-cyan">
                      <Phone className="h-3.5 w-3.5" /> Cyber Helpline
                    </p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">
                      {line.name}
                    </h4>
                    <p className="mt-1 text-base font-bold text-mint">
                      {line.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {line.description}
                    </p>
                    <a
                      href={line.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className="mt-3 inline-flex items-center gap-1 rounded-md border border-cyber-cyan/40 bg-cyber-cyan/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyber-cyan hover-glow"
                    >
                      {line.actionLabel}
                      {isExternal && <ExternalLink className="h-3.5 w-3.5" />}
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-white/20 glass-panel p-3">
              <p className="text-xs font-semibold text-cyber-cyan">
                Sources & Official References
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {indiaSourceNotes.map((source) => (
                  <a
                    key={source.name}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg border border-white/20 glass-panel-alt px-3 py-3 hover-glow"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {source.name}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {source.detail}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-cyber-cyan">
                      Visit source <ExternalLink className="h-3.5 w-3.5" />
                    </p>
                  </a>
                ))}
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
          TrustVault Shield
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
        TrustVault trusted detection platform
      </div>
    </div>
  );
};

export default Home;
