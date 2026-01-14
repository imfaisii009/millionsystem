"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    content: string;
    metrics: string;
    avatar?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Marcus Thorne",
        role: "CTO",
        company: "RetailFlow Global",
        content: "MillionSystems didn't just build a platform; they engineered a survival strategy. We survived our biggest Black Friday traffic spike in history with 100% uptime thanks to their architectural overhaul.",
        metrics: "99.99% Peak Uptime",
        avatar: "/avatars/ceo1.png"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "VP of Engineering",
        company: "Vault Finance",
        content: "Security is non-negotiable in FinTech. The team delivered a bank-grade audit trail and smart contract system that passed every external penetration test on the first try.",
        metrics: "Bank-Grade Security",
        avatar: "/avatars/ceo2.png"
    },
    {
        id: 3,
        name: "David Ross",
        role: "Founder",
        company: "SaaSify Ops",
        content: "They took our MVP and scaled it into a multi-tenant enterprise solution in under 3 months. The code quality is immaculate—clean, documented, and built for massive scale.",
        metrics: "3x Faster Launch",
        avatar: "/avatars/ceo3.png"
    },
    {
        id: 4,
        name: "Dr. Emily Viane",
        role: "Director of Product",
        company: "MediCore AI",
        content: "Integrating complex ML models into a consumer app is typically a nightmare. MillionSystems made it look easy. Our AI response time dropped by 60% immediately post-launch.",
        metrics: "60% Latency Drop",
        avatar: "/avatars/ceo4.png"
    },
    {
        id: 5,
        name: "James K.",
        role: "Head of Digital",
        company: "Global Freight",
        content: "A true digital transformation partner. They didn't just build software; they optimized our entire operational workflow through intelligent automation. The ROI has been undeniable.",
        metrics: "200% Efficiency Gain",
        avatar: "/avatars/ceo5.png"
    }
];

export function TestimonialDataStream() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-rotation logic
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <section className="relative py-32 overflow-hidden bg-[#030014]">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Main Interaction Area */}
                <div
                    className="relative min-h-[700px] flex flex-col items-center justify-start pt-10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Fixed Central Projection Beam (Spotlight) - BRIGHTER */}
                    <motion.div
                        animate={{
                            opacity: [0.6, 0.9, 0.6],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 2, repeat: Infinity
                        }}
                        className="absolute bottom-[200px] left-1/2 -translate-x-1/2 w-[350px] h-[450px] bg-blue-500/30 [clip-path:polygon(50%_100%,_0_0,_100%_0)] pointer-events-none blur-[60px] rotate-180 z-0"
                    />

                    {/* Central Glass Card */}
                    <div className="relative z-50 w-full max-w-4xl mx-auto mb-32">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl relative overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.1)]"
                            >
                                {/* Futuristic Internal Elements */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                                {/* Card Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                                <div className="absolute inset-0 bg-blue-500/10" />
                                                <img
                                                    src={testimonials[activeIndex].avatar}
                                                    alt={testimonials[activeIndex].name}
                                                    className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-full -z-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-white tracking-tight">
                                                {testimonials[activeIndex].name}
                                            </h4>
                                            <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">
                                                {testimonials[activeIndex].role} @ {testimonials[activeIndex].company}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex gap-1 text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            {testimonials[activeIndex].metrics}
                                        </div>
                                    </div>
                                </div>

                                {/* Content - REMOVED QUOTES */}
                                <blockquote className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light mb-12 italic relative">
                                    {testimonials[activeIndex].content}
                                </blockquote>

                                {/* Footer Action */}
                                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                    <div className="flex gap-2">
                                        {testimonials.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveIndex(i)}
                                                className={`h-1.5 transition-all duration-300 rounded-full ${i === activeIndex ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "w-2 bg-white/10 hover:bg-white/30"}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white hover:scale-105 active:scale-95"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white hover:scale-105 active:scale-95"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* The Sinusoidal Data Wave - SVG */}
                    <div className="absolute bottom-16 left-0 w-full h-32 pointer-events-none opacity-40">
                        <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
                            <motion.path
                                animate={{
                                    d: [
                                        "M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50",
                                        "M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50",
                                        "M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50"
                                    ]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                d="M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50"
                                stroke="url(#wave-gradient)"
                                strokeWidth="2"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="20%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#c084fc" />
                                    <stop offset="80%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Interactive Nodes Carousel - Moves Nodes Along Wave */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="relative flex items-center justify-center w-full max-w-5xl h-32">
                                {testimonials.map((t, idx) => {
                                    const offset = idx - activeIndex;

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={false}
                                            animate={{
                                                x: offset * 180,
                                                scale: idx === activeIndex ? 1.4 : 0.8,
                                                opacity: Math.abs(offset) > 2 ? 0 : (1 - Math.abs(offset) * 0.3),
                                                y: idx % 2 === 0 ? [15, 5, 15] : [5, 15, 5] // Adjusted higher base y for carousel
                                            }}
                                            transition={{
                                                x: { type: "spring", stiffness: 45, damping: 14 },
                                                scale: { duration: 0.4 },
                                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                            }}
                                            className="absolute"
                                        >
                                            <div className="relative group">
                                                <motion.div
                                                    onClick={() => setActiveIndex(idx)}
                                                    className={`w-14 h-14 rounded-full border-2 cursor-pointer transition-all duration-500 pointer-events-auto flex flex-col items-center justify-center
                                                        ${idx === activeIndex
                                                            ? "bg-blue-600 border-white ring-8 ring-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                                            : "bg-black/80 border-blue-500/30 hover:border-blue-400"
                                                        }
                                                    `}
                                                >
                                                    <span className="text-xs font-bold text-white font-mono">{idx + 1}</span>
                                                    {idx === activeIndex && (
                                                        <motion.div
                                                            layoutId="node-glow-active-carousel"
                                                            className="absolute inset-0 rounded-full bg-blue-400/50 blur-xl -z-10"
                                                        />
                                                    )}
                                                </motion.div>

                                                {/* Active Node Base Light (Fixed below center node) */}
                                                {idx === activeIndex && (
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="w-10 h-1.5 bg-blue-400 blur-[2px] rounded-full shadow-[0_0_15px_#3b82f6]"
                                                        />
                                                        <motion.div
                                                            animate={{ opacity: [0.1, 0.4, 0.1] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="w-[128px] h-[128px] bg-blue-500/30 blur-[50px] rounded-full -mt-12 -z-10"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Removed Here */}
            </div>
        </section>
    );
}
