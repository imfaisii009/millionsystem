"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    category?: string;
}

export function IQQuizCompact() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            // Fetch only 3 questions for the compact demo
            const response = await fetch('/api/iq-quiz/generate?count=3');
            const data = await response.json();
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

        const correct = index === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setScore(prev => prev + 1);
            // Small celebration
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#a855f7']
            });
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
            // Grand celebration
            const duration = 2000;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#a855f7', '#ec4899']
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#a855f7', '#ec4899']
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300 font-medium">Quick IQ Test</span>
                </div>
                {!isLoading && !quizCompleted && (
                    <span className="text-xs text-gray-500">
                        {currentIndex + 1}/{questions.length}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-3" />
                        <p className="text-gray-400 text-xs">Loading questions...</p>
                    </div>
                ) : quizCompleted ? (
                    <div className="text-center space-y-4 py-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto"
                        >
                            <Sparkles className="w-7 h-7 text-white" />
                        </motion.div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Complete!</h3>
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                {score}/{questions.length}
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm">
                            {score === questions.length ? "Perfect score!" :
                                score >= questions.length / 2 ? "Great job!" : "Keep practicing!"}
                        </p>

                        <button
                            onClick={fetchQuestions}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try Again
                        </button>
                    </div>
                ) : currentQuestion ? (
                    <div className="space-y-4">
                        {/* Progress */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question */}
                        <div className="text-center">
                            <h3 className="text-base md:text-lg font-semibold text-white leading-relaxed">
                                {currentQuestion.question}
                            </h3>
                            {currentQuestion.category && (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-[9px] uppercase tracking-wider text-gray-500 mt-2">
                                    {currentQuestion.category}
                                </span>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    whileHover={{ scale: selectedAnswer === null ? 1.01 : 1 }}
                                    whileTap={{ scale: selectedAnswer === null ? 0.99 : 1 }}
                                    className={`w-full relative p-3 rounded-xl border transition-all duration-200 text-left flex items-center justify-between ${selectedAnswer === index
                                        ? showResult && isCorrect
                                            ? 'border-green-500 bg-green-500/10'
                                            : showResult && !isCorrect
                                                ? 'border-red-500 bg-red-500/10'
                                                : 'border-purple-500 bg-purple-500/10'
                                        : showResult && index === currentQuestion.correctAnswer
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                                        } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${selectedAnswer === index
                                            ? 'border-purple-500 bg-purple-500 text-white'
                                            : 'border-white/20 text-white/60'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="text-white text-sm font-medium">{option}</span>
                                    </div>
                                    {showResult && selectedAnswer === index && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            {isCorrect ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </motion.div>
                                    )}
                                    {showResult && !isCorrect && index === currentQuestion.correctAnswer && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center pt-2"
                                >
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        {currentIndex < questions.length - 1 ? "Next →" : "Results"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
