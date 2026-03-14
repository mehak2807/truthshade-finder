import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Home,
  Zap,
  Target,
  Award,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressTracker from "@/components/educational/ProgressTracker";
import LessonCard from "@/components/educational/LessonCard";
import QuizCard from "@/components/educational/QuizCard";
import PracticeModeCard from "@/components/educational/PracticeModeCard";
import logo from "@/assets/trustvault-logo.png";

export interface Lesson {
  id: string;
  title: string;
  category: "tactics" | "sources" | "content" | "signals";
  description: string;
  explanation: string;
  realWorldExample: {
    title: string;
    content: string;
    verdict: "real" | "fake" | "suspicious";
  };
  redFlags: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

const lessons: Lesson[] = [
  {
    id: "clickbait-1",
    title: "Clickbait Headlines",
    category: "tactics",
    description:
      "Learn to identify sensationalized headlines designed to manipulate clicks",
    explanation:
      "Clickbait headlines use exaggeration, curiosity gaps, and emotional triggers to drive clicks without delivering promised content. Common tactics include: extreme punctuation (!!!), ALL CAPS keywords, false urgency ('SHOCKING!!!'), and misleading promises like 'You won't believe what happens next!'",
    realWorldExample: {
      title: "Example: COVID Vaccine Headline",
      content:
        "HEADLINE A: 'New COVID variant detected, experts say vaccine effectiveness may vary'\nHEADLINE B: 'SHOCKING: Vaccines secretly FAILING?! This ONE thing they don\\'t want you to know!!!'",
      verdict: "suspicious",
    },
    redFlags: [
      "Excessive punctuation marks (!!!, ???, ...)",
      "ALL CAPS for emphasis",
      "Artificial urgency words (SHOCKING, BREAKING, EXCLUSIVE)",
      "Promises content doesn't deliver",
      "Emotional manipulation phrases",
      "Sensationalized language vs factual tone",
    ],
    quiz: {
      question: "Which headline is most likely clickbait?",
      options: [
        "Health officials announce new guidelines for flu season",
        "WHAT DOCTORS DON'T WANT YOU TO KNOW ABOUT FLU SHOTS!!!",
        "Study shows flu vaccine effectiveness at 60% this season",
        "Flu vaccine availability announced for October 2026",
      ],
      correctAnswer: 1,
      explanation:
        "Option B uses excessive punctuation, ALL CAPS, emotional manipulation ('don't want you to know'), and false urgency - classic clickbait tactics. Options A, C, and D are factual headlines.",
    },
  },
  {
    id: "deepfakes-1",
    title: "Detecting Deepfakes",
    category: "content",
    description:
      "Understand how AI-generated content can be used to spread misinformation",
    explanation:
      "Deepfakes are videos or images where a person's appearance or voice is artificially manipulated using deep learning. They can be used to create false statements, embarrassing scenarios, or misleading content. Warning signs include: unnatural eye movements, inconsistent lighting, odd facial expressions, audio-video sync issues, and suspiciously perfect videos.",
    realWorldExample: {
      title: "Example: Viral Political Deepfake",
      content:
        "A video circulates showing a political leader saying something inflammatory. The video has: slightly unnatural eye movements, occasional sync issues between audio and lip movements, and inconsistent skin lighting on one side of the face.",
      verdict: "suspicious",
    },
    redFlags: [
      "Unnatural eye movements or blinking patterns",
      "Inconsistent lighting across face",
      "Audio-video sync mismatches",
      "Unusual facial expressions or microexpressions",
      "Skin texture inconsistencies",
      "Suspicious origins or sharing patterns",
      "Lack of original source confirmation",
    ],
    quiz: {
      question:
        "What is the MOST reliable way to verify if a video of a public figure is authentic?",
      options: [
        "Check if the video went viral on social media",
        "Contact the original source or official channels directly",
        "Look at the video quality and production values",
        "See if friends have shared it already",
      ],
      correctAnswer: 1,
      explanation:
        "Always verify through official, primary sources. Viral spread is not verification. Quality doesn't prove authenticity. Social sharing doesn't validate content. Direct contact with the source or official channels is the most reliable method.",
    },
  },
  {
    id: "fake-stats-1",
    title: "Fake Statistics & Data",
    category: "signals",
    description:
      "Learn to spot manipulated or invented statistics used to support false claims",
    explanation:
      "Misinformation often uses fake statistics, misrepresented data, or cherry-picked figures to support false narratives. Real statistics include sources, methodology, and context. Fake ones often appear without citations, use round numbers, lack context, or cherry-pick favorable data while ignoring contradicting information.",
    realWorldExample: {
      title: "Example: Health Claims",
      content:
        "CLAIM A: 'Studies show that 90% of doctors recommend this supplement' (no source cited)\nCLAIM B: 'According to a 2025 study by Journal of Medical Research, the supplement showed 28% improvement in sleep quality in 150 participants with initial sleep disorders'",
      verdict: "suspicious",
    },
    redFlags: [
      "No source citation or link",
      "Suspiciously round numbers (50%, 100%, 75%)",
      "Lack of sample size or methodology",
      "No date or publication information",
      "Cherry-picked data ignoring contradictions",
      "Vague attribution ('studies show', 'experts agree')",
      "Missing confidence intervals or margins of error",
    ],
    quiz: {
      question: "What makes a statistic credible?",
      options: [
        "It supports your existing beliefs",
        "It came from social media",
        "It includes source, methodology, sample size, and date",
        "It's a round number like 50% or 100%",
      ],
      correctAnswer: 2,
      explanation:
        "Credible statistics include: clear source citation, explanation of methodology, sample size, date, and confidence intervals. Round numbers are suspicious. Social media isn't a reliable source. Confirmation bias makes us believe statistics that match our beliefs, but that's not a validity indicator.",
    },
  },
  {
    id: "emotional-manipulation-1",
    title: "Emotional Manipulation",
    category: "tactics",
    description:
      "Identify how misinformation exploits emotions to bypass critical thinking",
    explanation:
      "Misinformation often targets emotions (fear, anger, outrage) rather than presenting facts. This bypasses our rational thinking and makes us more likely to share without verification. Common tactics include: fear-mongering, outrage-baiting, us-vs-them narratives, and appeals to tribalism.",
    realWorldExample: {
      title: "Example: Public Health Misinformation",
      content:
        "EMOTIONAL: 'THEY'RE TRYING TO POISON OUR CHILDREN!!! New requirement is DANGEROUS - share to save lives!!!'\nFACTUAL: 'New health guideline implemented; parents concerned about ingredient X should consult pediatrician'",
      verdict: "suspicious",
    },
    redFlags: [
      "ALL CAPS for emphasis creating urgency/fear",
      "Us-vs-them language ('They', 'The elites', 'Big X')",
      "Appeals to tribal identity",
      "Outrage-triggering language",
      "'Share to save lives' calls to action",
      "Fear-mongering phrases",
      "Lack of nuance or alternative perspectives",
    ],
    quiz: {
      question: "Why do emotional headlines spread faster than factual ones?",
      options: [
        "They're always more accurate",
        "They bypass our critical thinking and trigger sharing reflexes",
        "People don't care about facts",
        "Emotional content is always false",
      ],
      correctAnswer: 1,
      explanation:
        "Emotional content activates our amygdala (emotion center) faster than our prefrontal cortex (critical thinking). This triggers reflexive sharing. Emotional ≠ false, and factual information CAN be emotional, but high-emotion content without facts is particularly prone to viral misinformation.",
    },
  },
  {
    id: "source-credibility-1",
    title: "Evaluating Source Credibility",
    category: "sources",
    description:
      "Learn to assess whether a news source or account is trustworthy",
    explanation:
      "Not all sources are equally credible. Credible sources have: clear author identification, editorial oversight, fact-checking processes, corrections policy, financial transparency, and established reputation. Red flags include: anonymous authors, no corrections, obvious bias, financial conflicts of interest, and sensationalist language.",
    realWorldExample: {
      title: "Example: Two Sources Covering Same Story",
      content:
        "SOURCE A: Established news outlet with byline, editor, corrections policy\nSOURCE B: Anonymous blog with ads, no way to contact, makes absolute claims",
      verdict: "suspicious",
    },
    redFlags: [
      "Anonymous or hidden authors",
      "No way to contact or verify",
      "No corrections policy visible",
      "Excessive ads or financial incentives",
      "Single perspective only",
      "Lack of citations or sources",
      "Sensationalist domain name or branding",
    ],
    quiz: {
      question: "When evaluating a news source, what should you ALWAYS check?",
      options: [
        "How many followers they have on social media",
        "Author identity, publication date, and citations",
        "Whether the headline matches your political beliefs",
        "If the page looks professional",
      ],
      correctAnswer: 1,
      explanation:
        "Critical source evaluation requires: author verification, publication date, and cited sources. Followers don't guarantee credibility. Matching your beliefs is confirmation bias. Professional appearance can be faked. Always verify the 'who', 'when', and 'where' of information.",
    },
  },
  {
    id: "manipulated-images-1",
    title: "Manipulated Images & Context",
    category: "content",
    description:
      "Discover how images are edited or used out of context to mislead",
    explanation:
      "Images can be manipulated through: cropping (removing context), Photoshopping, filters, old images presented as new, misattribution (wrong event/date), and extreme close-ups. Context is everything. Always verify: image source, date, original context, and reverse image search results.",
    realWorldExample: {
      title: "Example: Environmental Claim",
      content:
        "IMAGE: Powerful photo of polar bear looking starving\nCLAIM: 'Climate change is destroying polar bears NOW'\nREALITY: Image is from 2009, captioned as showing normal wildlife, not climate emergency",
      verdict: "suspicious",
    },
    redFlags: [
      "No source or date on image",
      "Extreme cropping showing only part of scene",
      "Obvious editing or filter effects",
      "Image shared without context",
      "Reverse image search shows different original caption",
      "Image from unrelated event attributed to wrong event",
      "Sensationalist text overlay",
    ],
    quiz: {
      question:
        "What's the best first step when you see a striking image in a post?",
      options: [
        "Share it immediately to spread awareness",
        "Assume it's real because it's on social media",
        "Use reverse image search to find original source and date",
        "Look at how many people have reacted to it",
      ],
      correctAnswer: 2,
      explanation:
        "Reverse image search (Google Images, TinEye) allows you to find: original source, true date, original caption, and whether it's been used in other contexts. This reveals misrepresentation before you share. Never verify by engagement metrics or social media presence.",
    },
  },
];

const Learn = () => {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | Lesson["category"]
  >("all");
  const [showPracticeMode, setShowPracticeMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("educational_progress");
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleLessonComplete = (lessonId: string, score: number) => {
    const updated = new Set(completedLessons);
    updated.add(lessonId);
    setCompletedLessons(updated);
    localStorage.setItem("educational_progress", JSON.stringify([...updated]));

    setQuizAnswers((prev) => ({
      ...prev,
      [lessonId]: score,
    }));
  };

  const filteredLessons =
    selectedCategory === "all"
      ? lessons
      : lessons.filter((lesson) => lesson.category === selectedCategory);

  const categoryLabels = {
    tactics: "Common Tactics",
    sources: "Source Credibility",
    content: "Content Analysis",
    signals: "Red Flags & Signals",
  };

  const totalScore =
    Object.values(quizAnswers).reduce((a, b) => a + b, 0) /
      Object.keys(quizAnswers).length || 0;

  return (
    <div className="page-gradient min-h-screen overflow-hidden px-4 py-5 sm:px-8 sm:py-8">
      {/* Navigation Header */}
      <div className="mx-auto max-w-6xl mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between rounded-lg border border-mint border-opacity-40 glass-panel px-4 py-3 sm:px-6 sm:py-4 shadow-glow-md"
        >
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="TrustVault"
              className="h-8 w-8 rounded-md object-cover border border-mint border-opacity-40"
            />
            <div>
              <h1 className="text-lg font-bold text-gradient-cyber">
                Learn Misinformation Detection
              </h1>
              <p className="text-xs text-muted-foreground">
                Master the skills to identify false information
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-mint border-opacity-30 glass-panel px-4 py-2 text-sm font-semibold text-mint transition-all hover-glow"
          >
            <Home className="h-4 w-4" />
            Back Home
          </button>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Progress & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <ProgressTracker
            completedCount={completedLessons.size}
            totalCount={lessons.length}
            averageScore={totalScore}
            recentCompletions={Array.from(completedLessons).slice(-3)}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Category Filter */}
          <div className="rounded-lg glass-panel border border-mint border-opacity-20 p-4 shadow-glow-md">
            <p className="mb-3 text-sm font-semibold text-mint">
              Filter by Category
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all" as const, label: "All Lessons" },
                { key: "tactics" as const, label: "Tactics" },
                { key: "sources" as const, label: "Sources" },
                { key: "content" as const, label: "Content" },
                { key: "signals" as const, label: "Signals" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategory === cat.key
                      ? "neon-button"
                      : "button-ghost"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Mode CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPracticeMode(!showPracticeMode)}
            className="w-full rounded-lg glass-panel border border-mint border-opacity-30 p-4 shadow-glow-md hover-glow transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-mint flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Practice Mode
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a post or screenshot to test your skills and get
                  AI-powered analysis
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-mint" />
            </div>
          </motion.button>

          {/* Lessons Grid */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gradient-cyber">
              {selectedCategory === "all"
                ? "All Lessons"
                : categoryLabels[
                    selectedCategory as keyof typeof categoryLabels
                  ]}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <LessonCard
                      lesson={lesson}
                      isCompleted={completedLessons.has(lesson.id)}
                      score={quizAnswers[lesson.id] || 0}
                      onOpen={() => setActiveLesson(lesson.id)}
                      onComplete={handleLessonComplete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Active Lesson Modal */}
      <AnimatePresence>
        {activeLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveLesson(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-mint border-opacity-40 shadow-glow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {lessons
                .filter((l) => l.id === activeLesson)
                .map((lesson) => (
                  <div key={lesson.id} className="p-6 sm:p-8">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <div className="mb-2 inline-block rounded-full bg-mint bg-opacity-20 px-3 py-1 text-xs font-semibold text-mint">
                          {
                            categoryLabels[
                              lesson.category as keyof typeof categoryLabels
                            ]
                          }
                        </div>
                        <h2 className="text-2xl font-bold text-gradient-cyber">
                          {lesson.title}
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                          {lesson.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveLesson(null)}
                        className="rounded-lg p-2 hover:bg-mint hover:bg-opacity-10 transition-colors"
                      >
                        <X className="h-5 w-5 text-mint" />
                      </button>
                    </div>

                    <div className="space-y-6 border-t border-mint border-opacity-20 pt-6">
                      {/* Explanation */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-mint">
                          <BookOpen className="h-5 w-5" />
                          Learn
                        </h3>
                        <p className="rounded-lg bg-mint bg-opacity-5 p-4 text-foreground leading-relaxed">
                          {lesson.explanation}
                        </p>
                      </div>

                      {/* Real World Example */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-mint">
                          <Target className="h-5 w-5" />
                          Real-World Example
                        </h3>
                        <div className="rounded-lg glass-panel border border-mint border-opacity-20 p-4">
                          <h4 className="mb-2 font-semibold">
                            {lesson.realWorldExample.title}
                          </h4>
                          <p className="mb-3 whitespace-pre-wrap text-sm text-muted-foreground font-mono">
                            {lesson.realWorldExample.content}
                          </p>
                          <div
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              lesson.realWorldExample.verdict === "real"
                                ? "bg-ok-green bg-opacity-20 text-ok-green"
                                : lesson.realWorldExample.verdict ===
                                    "suspicious"
                                  ? "bg-warn-yellow bg-opacity-20 text-warn-yellow"
                                  : "bg-danger-red bg-opacity-20 text-danger-red"
                            }`}
                          >
                            {lesson.realWorldExample.verdict === "real"
                              ? "✓ Credible"
                              : lesson.realWorldExample.verdict === "suspicious"
                                ? "⚠ Suspicious"
                                : "✗ Misinformation"}
                          </div>
                        </div>
                      </div>

                      {/* Red Flags */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-mint">
                          <Zap className="h-5 w-5" />
                          Red Flags to Watch For
                        </h3>
                        <ul className="space-y-2">
                          {lesson.redFlags.map((flag, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-lg bg-danger-red bg-opacity-5 p-3"
                            >
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-danger-red flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {flag}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quiz */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-mint">
                          <Target className="h-5 w-5" />
                          Test Your Knowledge
                        </h3>
                        <QuizCard
                          quiz={lesson.quiz}
                          lessonId={lesson.id}
                          onComplete={(score) => {
                            handleLessonComplete(lesson.id, score);
                            setActiveLesson(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice Mode Modal */}
      <AnimatePresence>
        {showPracticeMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPracticeMode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl rounded-2xl glass-panel border border-mint border-opacity-40 shadow-glow-lg p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gradient-cyber flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    Practice Mode
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Upload content and get AI-powered educational analysis
                  </p>
                </div>
                <button
                  onClick={() => setShowPracticeMode(false)}
                  className="rounded-lg p-2 hover:bg-mint hover:bg-opacity-10 transition-colors"
                >
                  <X className="h-5 w-5 text-mint" />
                </button>
              </div>
              <PracticeModeCard onClose={() => setShowPracticeMode(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Learn;
