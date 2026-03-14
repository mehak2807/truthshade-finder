import { motion } from "framer-motion";

export interface Segment {
  text: string;
  level: "verified" | "questionable" | "misinformation";
  evidence_strength?: "strong" | "medium" | "weak" | "none";
}

interface HeatmapDemoProps {
  segments: Segment[];
}

const levelStyles = {
  verified: "bg-trust-verified/10 border-b border-trust-verified/30",
  questionable: "bg-trust-questionable/10 border-b border-trust-questionable/30",
  misinformation: "bg-trust-misinformation/10 border-b border-trust-misinformation/30",
};

const HeatmapDemo = ({ segments }: HeatmapDemoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-trust-verified/30" /> Verified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-trust-questionable/30" /> Questionable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-trust-misinformation/30" /> Likely False
        </span>
      </div>
      <motion.div className="text-sm leading-relaxed text-foreground/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {segments.map((seg, i) => (
          <motion.span
            key={i}
            className={`${levelStyles[seg.level]} px-0.5 rounded-sm`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.03 * i, duration: 0.3 }}
          >
            {seg.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default HeatmapDemo;
