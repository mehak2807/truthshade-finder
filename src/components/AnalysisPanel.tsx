import { motion } from "framer-motion";
import { Shield, AlertTriangle, XOctagon } from "lucide-react";

export interface Finding {
  title: string;
  description: string;
  type: "verified" | "questionable" | "misinformation";
}

interface AnalysisPanelProps {
  findings: Finding[];
}

const iconMap = {
  verified: <Shield className="w-5 h-5" />,
  questionable: <AlertTriangle className="w-5 h-5" />,
  misinformation: <XOctagon className="w-5 h-5" />,
};

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

const AnalysisPanel = ({ findings }: AnalysisPanelProps) => {
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
            <span className={`mt-0.5 ${iconColors[finding.type]}`}>{iconMap[finding.type]}</span>
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
