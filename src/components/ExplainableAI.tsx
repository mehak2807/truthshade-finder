import { motion } from "framer-motion";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExplainableAIProps {
  explanation: string;
}

const ExplainableAI = ({ explanation }: ExplainableAIProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Brain className="w-5 h-5 text-trust-glow" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explainable AI Reasoning</h3>
            <p className="text-xs text-muted-foreground">Why TrustVault rated this content the way it did</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <motion.div
          className="mt-4 pt-4 border-t border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
            {explanation}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExplainableAI;
