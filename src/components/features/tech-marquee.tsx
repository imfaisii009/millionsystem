"use client";

import { motion } from "framer-motion";
import {
    SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiNodedotjs,
    SiSupabase, SiPostgresql, SiFigma, SiPython, SiDocker, SiGraphql
} from "react-icons/si";

// You might need to install react-icons: npm install react-icons
// If not available, use simple text or lucide icons where possible, but brand icons are better.
// Assuming react-icons is NOT installed yet, I will use text/Lucide or fallback to standard SVGs if I can, 
// but for now let's use a text-based/simple icon marquee to avoid dependency issues if not installed.
// Or I can just check if I can install it. I'll stick to a text/styled box marquee for safety or use simple SVGs embedded.

const techs = [
    "React", "Next.js", "TypeScript", "Node.js", "Supabase", "PostgreSQL",
    "Tailwind CSS", "Framer Motion", "Docker", "AWS", "Figma", "Three.js"
];

export function TechMarquee() {
    return (
        <div className="relative flex overflow-hidden py-10 bg-background/50 border-y border-white/5">
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-background via-transparent to-background" />

            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {[...techs, ...techs].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground group-hover:from-white group-hover:to-white transition-all">
                            {tech}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
