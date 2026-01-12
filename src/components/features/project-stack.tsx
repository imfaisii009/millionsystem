"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const projects = [
    {
        title: "Fintech Dashboard",
        description: "Real-time financial data visualization for a global banking client.",
        tags: ["Next.js", "D3.js", "Supabase"],
        color: "from-blue-600 to-cyan-500",
        link: "#"
    },
    {
        title: "E-Commerce Platform",
        description: "Scalable marketplace solution handling 10k+ concurrent users.",
        tags: ["React", "Node.js", "Stripe"],
        color: "from-purple-600 to-pink-500",
        link: "#"
    },
    {
        title: "AI Content Generator",
        description: "Generative AI tool for marketing copy creation.",
        tags: ["OpenAI", "Python", "React"],
        color: "from-orange-600 to-red-500",
        link: "#"
    },
];

function ProjectCard({ project, index, range, targetScale }: any) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
                className="relative flex flex-col w-[1000px] h-[500px] rounded-3xl bg-[#18181b] border border-white/10 overflow-hidden shadow-2xl origin-top"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`} />

                <div className="flex h-full">
                    <div className="w-1/2 p-12 flex flex-col justify-between z-10">
                        <div>
                            <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                {project.title}
                            </h3>
                            <p className="text-muted-foreground text-lg mb-8">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link href={project.link} className="flex items-center gap-2 text-white font-medium hover:text-primary transition-colors group">
                            View Case Study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="w-1/2 relative bg-black/20 overflow-hidden group">
                        {/* Placeholder for project image */}
                        <div className={`absolute inset-4 rounded-xl bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 font-bold text-6xl">
                            {index + 1}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function ProjectStack() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={container} className="relative mt-20">
            {projects.map((project, i) => {
                const targetScale = 1 - ((projects.length - i) * 0.05);
                return <ProjectCard key={i} project={project} index={i} range={[i * 0.25, 1]} targetScale={targetScale} />;
            })}
        </div>
    );
}
