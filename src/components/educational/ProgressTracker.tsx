import { motion } from "framer-motion";
import { Award, TrendingUp, CheckCircle2, Lock } from "lucide-react";

interface ProgressTrackerProps {
  completedCount: number;
  totalCount: number;
  averageScore: number;
  recentCompletions: string[];
}

const badges = [
  {
    name: "First Step",
    icon: "🎓",
    condition: (c: number) => c >= 1,
    description: "Complete 1 lesson",
  },
  {
    name: "Tactician",
    icon: "🎯",
    condition: (c: number) => c >= 3,
    description: "Complete 3 lessons",
  },
  {
    name: "Detective",
    icon: "🔍",
    condition: (c: number) => c >= 5,
    description: "Complete 5 lessons",
  },
  {
    name: "Expert",
    icon: "⭐",
    condition: (c: number) => c >= lessons.length,
    description: "Master all lessons",
  },
];

const lessons = Array.from({ length: 6 }, (_, i) => `lesson-${i}`);

export default function ProgressTracker({
  completedCount,
  totalCount,
  averageScore,
  recentCompletions,
}: ProgressTrackerProps) {
  const progressPercent = (completedCount / totalCount) * 100;
  const earnedBadges = badges.filter((b) => b.condition(completedCount));
  const nextBadge = badges.find((b) => !b.condition(completedCount));

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg glass-panel border border-mint border-opacity-40 p-4 shadow-glow-md"
      >
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-mint">Your Progress</h3>
            <span className="text-sm font-bold text-mint">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full bg-mint bg-opacity-10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-mint to-neon-yellow shadow-glow-mint"
            />
          </div>
        </div>

        {/* Score Display */}
        <div className="rounded-lg bg-mint bg-opacity-5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Average Score</span>
            <span className="text-lg font-bold text-mint">
              {Math.round(averageScore * 100)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-lg glass-panel border border-mint border-opacity-40 p-4 shadow-glow-md"
      >
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-mint">
          <Award className="h-4 w-4" />
          Achievements
        </h3>

        <div className="space-y-2">
          {earnedBadges.map((badge) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-lg bg-ok-green bg-opacity-10 p-3"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {badge.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-ok-green flex-shrink-0" />
            </motion.div>
          ))}

          {nextBadge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-lg bg-warn-yellow bg-opacity-10 p-3 opacity-60"
            >
              <span className="text-2xl opacity-50">{nextBadge.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {nextBadge.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextBadge.description}
                </p>
              </div>
              <Lock className="h-5 w-5 text-warn-yellow flex-shrink-0" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-lg glass-panel border border-mint border-opacity-40 p-4 shadow-glow-md"
      >
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-mint">
          <TrendingUp className="h-4 w-4" />
          Quick Stats
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lessons Completed</span>
            <span className="font-semibold text-foreground">
              {completedCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-semibold text-mint">
              {totalCount - completedCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-semibold text-ok-green">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
