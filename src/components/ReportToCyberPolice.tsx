import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Props = {
  score: number;
  contentToReport?: string;
};

const ReportToCyberPolice = ({ score, contentToReport }: Props) => {
  const contacts = [
    {
      label: "National Cyber Crime Helpline",
      value: "1930",
      href: "tel:1930",
      icon: <PhoneCall className="h-4 w-4" />,
      hint: "Call 1930 (India) — available 24/7",
    },
    {
      label: "Cyber Crime Reporting Portal",
      value: "cybercrime.gov.in",
      href: "https://cybercrime.gov.in/",
      icon: <ExternalLink className="h-4 w-4" />,
      hint: "File an official online complaint",
    },
  ];

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <motion.div
      className="mt-6 rounded-2xl border border-trust-misinformation/30 bg-trust-misinformation/5 p-5 shadow-card relative overflow-hidden"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-trust-misinformation/15 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-trust-questionable/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-trust-misinformation/15 flex items-center justify-center border border-trust-misinformation/20">
            <ShieldAlert className="h-5 w-5 text-trust-misinformation" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-trust-misinformation">
              Low Credibility Detected — Score: {score}/100
            </h3>
            <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
              This content appears unreliable. If you believe it is harmful, fraudulent, or part of a
              scam, you can report it to Indian cyber authorities.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: Before reporting, save screenshots, sender details, links, and timestamps as evidence.
            </p>
          </div>
        </div>

        {/* Copy analyzed content */}
        {contentToReport && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyText(contentToReport)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy analyzed content
            </button>
          </div>
        )}

        {/* Contact cards */}
        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          {contacts.map((c) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="group rounded-xl border border-border bg-card/70 p-3 hover:bg-card transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-bold text-foreground truncate">{c.value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{c.hint}</p>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </div>
            </motion.a>
          ))}
        </div>

        <p className="pt-1 text-[11px] text-muted-foreground">
          Disclaimer: This tool provides guidance only. Always use official government portals and verified contacts when filing a report.
        </p>
      </div>
    </motion.div>
  );
};

export default ReportToCyberPolice;
