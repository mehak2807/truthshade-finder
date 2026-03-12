import { motion } from "framer-motion";

interface Segment {
  text: string;
  level: "verified" | "questionable" | "misinformation";
}

const sampleSegments: Segment[] = [
  { text: "A new study published in the Journal of Medicine", level: "verified" },
  { text: " found that drinking 8 glasses of water daily ", level: "verified" },
  { text: "cures all known diseases", level: "misinformation" },
  { text: ", according to researchers at Harvard University. ", level: "verified" },
  { text: "The study, which has not yet been peer-reviewed", level: "questionable" },
  { text: ", analyzed data from over 10,000 participants. ", level: "verified" },
  { text: "Experts warn that these claims are exaggerated and lack scientific basis", level: "questionable" },
  { text: ". The WHO has confirmed ", level: "verified" },
  { text: "water has miraculous healing properties that pharmaceutical companies don't want you to know about", level: "misinformation" },
  { text: ".", level: "verified" },
];

const levelStyles = {
  verified: "bg-trust-verified/15 border-b-2 border-trust-verified/40",
  questionable: "bg-trust-questionable/15 border-b-2 border-trust-questionable/40",
  misinformation: "bg-trust-misinformation/15 border-b-2 border-trust-misinformation/40",
};

const HeatmapDemo = () => {
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
        {sampleSegments.map((seg, i) => (
          <motion.span
            key={i}
            className={`${levelStyles[seg.level]} px-0.5 rounded-sm`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          >
            {seg.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default HeatmapDemo;
