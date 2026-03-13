import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Search, Scan, Globe, Zap, Lock, Eye } from "lucide-react";
import logo from "@/assets/trustvault-logo.png";

const features = [
  { icon: Search, title: "AI-Powered Analysis", desc: "Deep analysis of claims, sources, and language patterns using cutting-edge AI models." },
  { icon: Scan, title: "Image OCR", desc: "Upload screenshots of articles or social posts — text is extracted and analyzed instantly." },
  { icon: Globe, title: "URL Analysis", desc: "Paste any article URL and get a full credibility breakdown in seconds." },
  { icon: Zap, title: "Real-Time Results", desc: "Get instant credibility scores, risk assessments, and detailed findings." },
  { icon: Lock, title: "Trust Scoring", desc: "Multi-dimensional scoring across source reliability, claim accuracy, and language tone." },
  { icon: Eye, title: "Explainable AI", desc: "Transparent reasoning — see exactly why content was flagged or verified." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="TrustVault" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold font-['Space_Grotesk'] tracking-tight text-foreground">TrustVault</span>
          </div>
          <button
            onClick={() => navigate("/analyze")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start Analysis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img src={logo} alt="TrustVault" className="w-28 h-28 rounded-2xl shadow-elevated mx-auto mb-8 object-cover" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Don't believe everything<br />
            <span className="text-primary">you read online.</span>
          </motion.h1>

          <motion.p
            className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            TrustVault uses AI to analyze news, claims, and social media posts — giving you a credibility score in seconds.
          </motion.p>

          <motion.button
            onClick={() => navigate("/analyze")}
            className="mt-10 flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-all shadow-elevated"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShieldCheck className="w-5 h-5" />
            Start Analysis
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Divider */}
      <div className="container max-w-6xl mx-auto px-4">
        <div className="border-t border-border" />
      </div>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">How it works</h2>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
            Paste text, upload an image, or enter a URL — and let AI do the fact-checking.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          className="rounded-2xl bg-primary/5 border border-primary/15 p-10 sm:p-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="TrustVault" className="w-14 h-14 rounded-xl mx-auto mb-5 object-cover" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
            Ready to verify the truth?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
            Start analyzing any claim, article, or screenshot right now — completely free.
          </p>
          <motion.button
            onClick={() => navigate("/analyze")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <img src={logo} alt="TrustVault" className="w-5 h-5 rounded object-cover" />
          <span>TrustVault — Fake News Detector</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
