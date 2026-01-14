"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    category?: string; // Added category for new functionality
}

export function IQQuiz() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showHearts, setShowHearts] = useState(false);

    // Fetch questions on component mount
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/iq-quiz/generate');
            const data = await response.json();
            // Handle both array (new API) and object (fallback/legacy)
            const questionArray = Array.isArray(data) ? data : [data];
            setQuestions(questionArray);
            setCurrentIndex(0);
            setScore(0);
            setQuizCompleted(false);
            setSelectedAnswer(null);
            setShowResult(false);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null || showResult) return;

        const currentQuestion = questions[currentIndex];
        setSelectedAnswer(index);

        // Validate locally
        const correct = index === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setScore(prev => prev + 1);
            triggerCelebration(false); // Small celebration for single question
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
        } else {
            setQuizCompleted(true);
            triggerCelebration(true); // Big celebration for finish
        }
    };

    const triggerCelebration = (isGrand: boolean) => {
        if (isGrand) {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 5000);

            const duration = 3000;
            const end = Date.now() + duration;
            // Grand confetti logic...
            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#a855f7', '#ec4899']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#a855f7', '#ec4899']
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        } else {
            // Small burst for correct answer
            confetti({
                particleCount: 40,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#a855f7']
            });
        }
    };

    const currentQuestion = questions[currentIndex];

    return (
        <section className="relative py-32 w-full flex flex-col items-center justify-center overflow-hidden bg-[#02040a]" id="iq-quiz">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-30 blur-[130px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300 font-medium">Test Your IQ</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Challenge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Mind</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Take our 10-question AI-generated IQ test to evaluate your logic and reasoning skills.
                    </p>
                </motion.div>

                {/* Quiz Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_-20px_rgba(168,85,247,0.01)] min-h-[400px]">
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] pointer-events-none" />

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 h-full">
                                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                                <p className="text-gray-400 text-sm">Generating unique questions...</p>
                            </div>
                        ) : quizCompleted ? (
                            <div className="text-center space-y-8 py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl"
                                >
                                    <Sparkles className="w-12 h-12 text-white" />
                                </motion.div>

                                <div>
                                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">Quiz Completed!</h3>
                                    <p className="text-gray-400 text-xl">Your Final Score</p>
                                </div>

                                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    {score}/{questions.length}
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto">
                                    <p className="text-white/80">
                                        {score >= questions.length * 0.8 ? "🌟 Incredible! You're a genius!" :
                                            score >= questions.length * 0.5 ? "👏 Great job! Solid logical thinking." :
                                                "🧠 Keep practicing to sharpen your mind!"}
                                    </p>
                                </div>

                                <button
                                    onClick={fetchQuestions}
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all hover:scale-105"
                                >
                                    Take New Quiz
                                </button>
                            </div>
                        ) : currentQuestion ? (
                            <div className="space-y-8">
                                {/* Progress Bar */}
                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                    <span>Question {currentIndex + 1} of {questions.length}</span>
                                    <span>Score: {score}</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                    />
                                </div>

                                {/* Question */}
                                <div className="text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-relaxed">
                                        {currentQuestion.question}
                                    </h3>
                                    {currentQuestion.category && (
                                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-gray-500 mt-2 border border-white/5">
                                            {currentQuestion.category}
                                        </span>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleAnswerSelect(index)}
                                            disabled={selectedAnswer !== null}
                                            whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                                            whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${selectedAnswer === index
                                                ? showResult && isCorrect
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : showResult && !isCorrect
                                                        ? 'border-red-500 bg-red-500/10'
                                                        : 'border-purple-500 bg-purple-500/10'
                                                : showResult && index === currentQuestion.correctAnswer
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                                                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${selectedAnswer === index
                                                        ? 'border-purple-500 bg-purple-500 text-white'
                                                        : 'border-white/20 text-white/60 group-hover:border-purple-500/50'
                                                        }`}>
                                                        {String.fromCharCode(65 + index)}
                                                    </div>
                                                    <span className="text-white font-medium text-lg">{option}</span>
                                                </div>
                                                {showResult && selectedAnswer === index && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", bounce: 0.5 }}
                                                    >
                                                        {isCorrect ? (
                                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-6 h-6 text-red-500" />
                                                        )}
                                                    </motion.div>
                                                )}
                                                {showResult && !isCorrect && index === currentQuestion.correctAnswer && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", bounce: 0.5 }}
                                                    >
                                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Next Button (appears after selection) */}
                                <AnimatePresence>
                                    {showResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center pt-4"
                                        >
                                            <button
                                                onClick={handleNextQuestion}
                                                className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                            >
                                                {currentIndex < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : null}
                    </div>
                </motion.div>

                {/* Floating Hearts Animation */}
                <AnimatePresence>
                    {showHearts && (
                        <>
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 1,
                                        y: 100,
                                        x: Math.random() * window.innerWidth,
                                        scale: 0.5 + Math.random() * 0.5
                                    }}
                                    animate={{
                                        opacity: 0,
                                        y: -500,
                                        x: Math.random() * window.innerWidth,
                                        rotate: Math.random() * 360
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        delay: Math.random() * 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="fixed pointer-events-none z-[9999]"
                                >
                                    <Heart className="w-8 h-8 fill-pink-500 text-pink-500" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
