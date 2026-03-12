import { motion } from "framer-motion";
import { Shield, AlertTriangle, XOctagon, Brain } from "lucide-react";

interface Finding {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: "verified" | "questionable" | "misinformation";
}

const findings: Finding[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Source Attribution Verified",
    description: "The Journal of Medicine and Harvard University are real institutions with verifiable research records.",
    type: "verified",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Missing Peer Review",
    description: "The study has not been peer-reviewed, which weakens the reliability of the claims significantly.",
    type: "questionable",
  },
  {
    icon: <XOctagon className="w-5 h-5" />,
    title: "Exaggerated Health Claims",
    description: "'Cures all known diseases' is a classic misinformation pattern. No single substance can cure all diseases.",
    type: "misinformation",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Conspiracy Language Detected",
    description: "Phrases like 'don't want you to know' are emotional manipulation tactics commonly used in misinformation.",
    type: "misinformation",
  },
];

const typeStyles = {
  verified: "border-trust-verified/30 bg-trust-verified/5",
  questionable: "border-trust-questionable/30 bg-trust-questionable/5",
  misinformation: "border-trust-misinformation/30 bg-trust-misinformation/5",
};

const iconColors = {
  verified: "text-trust-verified",
  questionable: "text-trust-questionable",
  misinformation: "text-trust-misinformation",
};

const AnalysisPanel = () => {
  return (
    <div className="space-y-3">
      {findings.map((finding, i) => (
        <motion.div
          key={i}
          className={`border rounded-lg p-4 ${typeStyles[finding.type]}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 * i, duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 ${iconColors[finding.type]}`}>{finding.icon}</span>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{finding.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{finding.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalysisPanel;
