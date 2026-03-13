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
      className="rounded-xl border border-border bg-card p-5 shadow-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Reasoning</h3>
            <p className="text-xs text-muted-foreground">Why this content was rated this way</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <motion.div className="mt-4 pt-4 border-t border-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{explanation}</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExplainableAI;
