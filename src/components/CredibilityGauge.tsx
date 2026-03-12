import { motion } from "framer-motion";

interface CredibilityGaugeProps {
  score: number; // 0-100
  label: string;
}

const CredibilityGauge = ({ score, label }: CredibilityGaugeProps) => {
  const getColor = () => {
    if (score >= 70) return "text-trust-verified";
    if (score >= 40) return "text-trust-questionable";
    return "text-trust-misinformation";
  };

  const getTrackColor = () => {
    if (score >= 70) return "stroke-trust-verified";
    if (score >= 40) return "stroke-trust-questionable";
    return "stroke-trust-misinformation";
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-secondary" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none" strokeWidth="8"
            strokeLinecap="round"
            className={getTrackColor()}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-3xl font-bold font-['Space_Grotesk'] ${getColor()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

export default CredibilityGauge;
