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
  verified: "border-trust-verified/20 bg-trust-verified/5",
  questionable: "border-trust-questionable/20 bg-trust-questionable/5",
  misinformation: "border-trust-misinformation/20 bg-trust-misinformation/5",
};

const iconColors = {
  verified: "text-trust-verified",
  questionable: "text-trust-questionable",
  misinformation: "text-trust-misinformation",
};

const AnalysisPanel = ({ findings }: AnalysisPanelProps) => {
  return (
    <div className="space-y-2.5">
      {findings.map((finding, i) => (
        <motion.div
          key={i}
          className={`border rounded-lg p-3.5 ${typeStyles[finding.type]}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 * i, duration: 0.4 }}
        >
          <div className="flex items-start gap-2.5">
            <span className={`mt-0.5 ${iconColors[finding.type]}`}>{iconMap[finding.type]}</span>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{finding.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{finding.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalysisPanel;
