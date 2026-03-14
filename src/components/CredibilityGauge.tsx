import { motion } from "framer-motion";

interface CredibilityGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

const CredibilityGauge = ({ score, label, size = "lg" }: CredibilityGaugeProps) => {
  const getColor = () => {
    if (score >= 70) return { text: "text-sky-300", stroke: "stroke-sky-300", bg: "bg-sky-300/10" };
    if (score >= 40) return { text: "text-amber-300", stroke: "stroke-amber-300", bg: "bg-amber-300/10" };
    return { text: "text-rose-300", stroke: "stroke-rose-300", bg: "bg-rose-300/10" };
  };

  const getGlow = () => {
    if (score >= 70) return "shadow-[0_0_24px_rgba(125,211,252,0.28)]";
    if (score >= 40) return "shadow-[0_0_24px_rgba(252,211,77,0.24)]";
    return "shadow-[0_0_24px_rgba(251,113,133,0.24)]";
  };

  // Labels reflect a confidence/credibility estimate, not a binary truth verdict.
  const getLabel = () => {
    if (score >= 70) return "High confidence";
    if (score >= 40) return "Medium confidence";
    return "Low confidence";
  };

  const colors = getColor();
  const glow = getGlow();
  const isLarge = size === "lg";
  const radius = isLarge ? 52 : 36;
  const strokeWidth = isLarge ? 6 : 5;
  const viewBox = isLarge ? 120 : 84;
  const center = viewBox / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${isLarge ? "w-32 h-32" : "w-20 h-20"}`}>
        <div
          className={`absolute inset-0 rounded-full ${colors.bg} ${glow}`}
          aria-hidden="true"
        />
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBox} ${viewBox}`}>
          <circle
            cx={center} cy={center} r={radius}
            fill="none" strokeWidth={strokeWidth}
            className="stroke-white/25"
          />
          <motion.circle
            cx={center} cy={center} r={radius}
            fill="none" strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={colors.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${isLarge ? "text-2xl" : "text-base"} font-bold font-['Space_Grotesk'] ${colors.text}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {score}
          </motion.span>
          {isLarge && (
            <span className={`text-[10px] font-medium ${colors.text} mt-0.5`}>{getLabel()}</span>
          )}
        </div>
      </div>
      <span className={`${isLarge ? "text-xs" : "text-[11px]"} text-foreground/85 font-medium`}>{label}</span>
    </div>
  );
};

export default CredibilityGauge;
