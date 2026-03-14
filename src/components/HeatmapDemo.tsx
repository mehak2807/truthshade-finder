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
  verified: "bg-cyan-500/18 border-b border-cyan-300/55 text-cyan-100",
  questionable: "bg-amber-500/18 border-b border-amber-300/55 text-amber-100",
  misinformation: "bg-rose-500/20 border-b border-rose-300/55 text-rose-100",
};

const HeatmapDemo = ({ segments }: HeatmapDemoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs text-foreground/80">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300/85" /> Verified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-300/85" /> Questionable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-300/85" /> Likely False
        </span>
      </div>
      <motion.div className="text-sm leading-relaxed text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
