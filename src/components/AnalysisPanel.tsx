import { motion } from "framer-motion";
import { Shield, AlertTriangle, XOctagon } from "lucide-react";

export interface Finding {
  title: string;
  description: string;
  type: "verified" | "questionable" | "misinformation";
  evidence_strength?: "strong" | "medium" | "weak" | "none";
}

interface AnalysisPanelProps {
  findings: Finding[];
}

const iconMap = {
  verified: <Shield className="w-4 h-4" />,
  questionable: <AlertTriangle className="w-4 h-4" />,
  misinformation: <XOctagon className="w-4 h-4" />,
};

const typeStyles = {
  verified: "border-green-500/40 glass-panel glow-green",
  questionable: "border-amber-500/40 glass-panel glow-amber",
  misinformation: "border-red-500/40 glass-panel glow-red",
};

const iconColors = {
  verified: "text-green-400",
  questionable: "text-amber-400",
  misinformation: "text-red-400",
};

const AnalysisPanel = ({ findings }: AnalysisPanelProps) => {
  return (
    <div className="space-y-2.5">
      {findings.map((finding, i) => (
        <motion.div
          key={i}
          className={`border rounded-lg p-3.5 ${typeStyles[finding.type]} fade-in hover-glow transition-all`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 * i, duration: 0.4 }}
        >
          <div className="flex items-start gap-2.5">
            <span className={`mt-0.5 ${iconColors[finding.type]}`}>
              {iconMap[finding.type]}
            </span>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                {finding.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {finding.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalysisPanel;
