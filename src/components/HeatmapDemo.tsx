import { motion } from "framer-motion";

export interface Segment {
  text: string;
  level: "verified" | "questionable" | "misinformation";
}

interface HeatmapDemoProps {
  segments: Segment[];
}

const levelStyles = {
  verified: "bg-trust-verified/15 border-b-2 border-trust-verified/40",
  questionable: "bg-trust-questionable/15 border-b-2 border-trust-questionable/40",
  misinformation: "bg-trust-misinformation/15 border-b-2 border-trust-misinformation/40",
};

const HeatmapDemo = ({ segments }: HeatmapDemoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-trust-verified/30" /> Verified
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-trust-questionable/30" /> Questionable
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-trust-misinformation/30" /> Likely False
        </span>
      </div>

      <motion.div
        className="text-base leading-relaxed text-foreground/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {segments.map((seg, i) => (
          <motion.span
            key={i}
            className={`${levelStyles[seg.level]} px-0.5 rounded-sm`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            {seg.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default HeatmapDemo;
