"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const projects = [
    {
        title: "Fintech Dashboard",
        description: "Real-time financial data visualization for a global banking client.",
        image: "/projects/fintech-dashboard.webp",
        techStack: ["Next.js", "D3.js", "Supabase"],
        color: "from-blue-500 to-cyan-400",
        shadow: "shadow-[0_0_100px_-20px_rgba(59,130,246,0.01)]",
        link: "#",
    },
    {
        title: "E-Commerce Platform",
        description: "Scalable marketplace solution handling 10k+ concurrent users.",
        image: "/projects/ecommerce-platform.webp",
        techStack: ["React", "Node.js", "Stripe"],
        color: "from-purple-500 to-pink-500",
        shadow: "shadow-[0_0_100px_-20px_rgba(168,85,247,0.01)]",
        link: "#",
    },
    {
        title: "AI Content Generator",
        description: "Generative AI tool for marketing copy creation.",
        image: "/projects/ai-content-generator.webp",
        techStack: ["OpenAI", "Python", "React"],
        color: "from-orange-500 to-red-500",
        shadow: "shadow-[0_0_100px_-20px_rgba(249,115,22,0.01)]",
        link: "#",
    },
];

export function ProjectStack() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const getProject = (offset: number) => {
        return projects[(currentIndex + offset + projects.length) % projects.length];
    };

    return (
        <section className="relative py-32 w-full flex flex-col items-center justify-center overflow-hidden bg-[#02040a]">

            {/* Dynamic Background Ambience - Changes with Project */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r ${projects[currentIndex].color} opacity-5 blur-[130px] pointer-events-none rounded-full`}
                />
            </AnimatePresence>

            <div className="relative w-full max-w-[1600px] h-[600px] flex items-center justify-center">

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-[4%] md:left-[8%] z-50 p-4 text-white/70 hover:text-white hover:scale-110 transition-all rounded-full bg-white/5 backdrop-blur-md border border-white/10"
                >
                    <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-[4%] md:right-[8%] z-50 p-4 text-white/70 hover:text-white hover:scale-110 transition-all rounded-full bg-white/5 backdrop-blur-md border border-white/10"
                >
                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>

                {/* CAROUSEL TRACK */}
                <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] overflow-visible">

                    {/* PREVIOUS CARD (Left Ghost) */}
                    <div
                        onClick={prevSlide}
                        className="absolute left-[-150px] md:left-[-80px] lg:left-[1%] top-1/2 -translate-y-1/2 w-[400px] h-[450px] z-10 hidden md:flex cursor-pointer opacity-30 hover:opacity-50 scale-90 blur-[1px] transition-all duration-500"
                    >
                        <div className="w-full h-full rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                            {/* Image Preview */}
                            <Image
                                src={getProject(-1).image}
                                alt={getProject(-1).title}
                                fill
                                className="object-cover opacity-50"
                                sizes="400px"
                            />
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                            {/* Title at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h4 className="text-2xl font-bold text-white/60">{getProject(-1).title}</h4>
                            </div>
                        </div>
                    </div>

                    {/* NEXT CARD (Right Ghost) */}
                    <div
                        onClick={nextSlide}
                        className="absolute right-[-150px] md:right-[-80px] lg:right-[1%] top-1/2 -translate-y-1/2 w-[400px] h-[450px] z-10 hidden md:flex cursor-pointer opacity-30 hover:opacity-50 scale-90 blur-[1px] transition-all duration-500"
                    >
                        <div className="w-full h-full rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                            {/* Image Preview */}
                            <Image
                                src={getProject(1).image}
                                alt={getProject(1).title}
                                fill
                                className="object-cover opacity-50"
                                sizes="400px"
                            />
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                            {/* Title at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h4 className="text-2xl font-bold text-white/60">{getProject(1).title}</h4>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE CARD (Center) */}
                    <motion.div
                        key={currentIndex}
                        className="relative z-30 w-[90%] md:w-[70%] max-w-6xl aspect-[16/9] md:h-[580px] md:aspect-auto"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    >
                        {/* Glass Container */}
                        <div className={`w-full h-full flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-700 ${projects[currentIndex].shadow}`}>

                            {/* Subtle Inner Noise/Texture */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                            {/* Left Content Half */}
                            <div className="w-full md:w-[45%] p-8 md:p-14 flex flex-col justify-center relative z-20">

                                {/* Title Group */}
                                <div className="space-y-6">
                                    <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                                        {getProject(0).title}
                                    </h3>

                                    <p className="text-lg text-blue-100/60 leading-relaxed font-light">
                                        {getProject(0).description}
                                    </p>
                                </div>

                                {/* Tech Stack Pills - Always Visible */}
                                <div className="flex flex-wrap gap-2 my-8">
                                    {getProject(0).techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 text-sm font-medium rounded-full bg-white/10 border border-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={getProject(0).link}
                                    className="flex items-center gap-3 text-white font-semibold text-lg group w-fit px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
                                >
                                    View Case Study
                                    <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>

                            {/* Right Image Half - Scrolling Mockup */}
                            <div className="w-full md:w-[55%] relative flex items-center justify-center p-6 md:p-10 overflow-hidden">

                                {/* Inner Card Glow */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr ${getProject(0).color} opacity-20 blur-[90px] pointer-events-none transition-colors duration-700`} />

                                {/* Project Mockup Container - Browser Frame Style */}
                                <div className="relative z-10 w-full h-full max-h-[420px] rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden group bg-[#0a0a0a]">

                                    {/* Browser Top Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-[#1a1a1a] border-b border-white/10 flex items-center px-4 z-20">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="ml-4 flex-1 max-w-[200px] h-5 rounded bg-white/5 flex items-center justify-center">
                                            <span className="text-[10px] text-white/30 truncate px-2">{getProject(0).title.toLowerCase().replace(/\s+/g, '-')}.com</span>
                                        </div>
                                    </div>

                                    {/* Scrolling Image Container */}
                                    <div className="absolute top-8 left-0 right-0 bottom-0 overflow-hidden">
                                        <motion.div
                                            key={`scroll-${currentIndex}`}
                                            className="relative w-full"
                                            initial={{ y: "0%" }}
                                            animate={{
                                                y: ["0%", "-60%", "-60%", "0%", "0%"]
                                            }}
                                            transition={{
                                                duration: 12,
                                                ease: "easeInOut",
                                                repeat: Infinity,
                                                times: [0, 0.4, 0.5, 0.9, 1]
                                            }}
                                        >
                                            <Image
                                                src={getProject(0).image}
                                                alt={`${getProject(0).title} full page screenshot`}
                                                width={600}
                                                height={1800}
                                                className="w-full h-auto object-contain object-top"
                                                priority={currentIndex === 0}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Top/Bottom fade for smooth scroll effect */}
                                    <div className="absolute top-8 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                                    {/* Enhanced Glass Sheen on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-4 mt-12 relative z-30">
                {projects.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${idx === currentIndex
                            ? "bg-white w-8 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                            : "bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
