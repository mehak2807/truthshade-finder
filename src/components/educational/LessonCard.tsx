import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import type { Lesson } from "@/pages/Learn";

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  score: number;
  onOpen: () => void;
  onComplete: (lessonId: string, score: number) => void;
}

export default function LessonCard({
  lesson,
  isCompleted,
  score,
  onOpen,
}: LessonCardProps) {
  const scorePercent = Math.round(score * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="group relative cursor-pointer rounded-lg glass-panel border border-mint border-opacity-30 p-4 shadow-glow-md transition-all hover:border-mint hover:border-opacity-50 hover:shadow-glow-lg"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-mint to-neon-yellow opacity-0 group-hover:opacity-5 transition-opacity" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="mb-2 inline-block rounded-full bg-mint bg-opacity-20 px-2.5 py-1 text-[10px] font-semibold text-mint">
              {lesson.category.charAt(0).toUpperCase() +
                lesson.category.slice(1)}
            </div>
            <h3 className="text-lg font-bold text-gradient-cyber line-clamp-2">
              {lesson.title}
            </h3>
          </div>

          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 flex-shrink-0"
            >
              <CheckCircle2 className="h-6 w-6 text-ok-green" />
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {lesson.description}
        </p>

        {/* Score Display (if completed) */}
        {isCompleted && (
          <div className="mb-4 rounded-lg bg-ok-green bg-opacity-10 p-3 border border-ok-green border-opacity-30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ok-green">
                Quiz Score
              </span>
              <span className="text-lg font-bold text-ok-green">
                {scorePercent}%
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-ok-green bg-opacity-20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-ok-green"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-ok-green" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Learn & Quiz</span>
              </>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-mint transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}
