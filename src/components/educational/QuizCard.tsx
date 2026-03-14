import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  quiz: QuizProps;
  lessonId: string;
  onComplete: (score: number) => void;
}

export default function QuizCard({
  quiz,
  lessonId,
  onComplete,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selectedAnswer === quiz.correctAnswer;
  const score = isCorrect ? 1 : 0;

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete(score);
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="rounded-lg bg-mint bg-opacity-5 p-4 border border-mint border-opacity-20">
        <p className="text-lg font-semibold text-foreground">{quiz.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((option, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => !showResult && setSelectedAnswer(idx)}
            disabled={showResult}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
              selectedAnswer === idx
                ? "border-mint bg-mint bg-opacity-10"
                : "border-mint border-opacity-20 hover:border-mint hover:border-opacity-40"
            } ${showResult && idx === quiz.correctAnswer && "border-ok-green bg-ok-green bg-opacity-10"} ${
              showResult &&
              selectedAnswer === idx &&
              !isCorrect &&
              "border-danger-red bg-danger-red bg-opacity-10"
            } ${showResult && "cursor-not-allowed opacity-75"}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selectedAnswer === idx
                    ? "border-mint bg-mint bg-opacity-20"
                    : "border-mint border-opacity-40"
                } ${showResult && idx === quiz.correctAnswer && "border-ok-green bg-ok-green bg-opacity-20"} ${
                  showResult &&
                  selectedAnswer === idx &&
                  !isCorrect &&
                  "border-danger-red bg-danger-red bg-opacity-20"
                }`}
              >
                {selectedAnswer === idx && !showResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-mint"
                  />
                )}
                {showResult && idx === quiz.correctAnswer && (
                  <CheckCircle2 className="h-4 w-4 text-ok-green" />
                )}
                {showResult && selectedAnswer === idx && !isCorrect && (
                  <XCircle className="h-4 w-4 text-danger-red" />
                )}
              </div>
              <span className="text-foreground">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Result Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-lg border p-4 ${
              isCorrect
                ? "border-ok-green bg-ok-green bg-opacity-5"
                : "border-danger-red bg-danger-red bg-opacity-5"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-ok-green" />
                  <span className="font-semibold text-ok-green">
                    Correct! Well done!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-danger-red" />
                  <span className="font-semibold text-danger-red">
                    Incorrect
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {quiz.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit/Continue Button */}
      {!showResult ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full neon-button rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full neon-button rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2"
        >
          {isCorrect ? "Great! Continue" : "Try Another Lesson"}
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
}
