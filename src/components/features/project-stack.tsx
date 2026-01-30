"use client";

import { motion } from "framer-motion";
import { Shield, Trophy, Dice5 } from "lucide-react";

const categories = [
    {
        title: "VPN",
        description:
            "High-performance privacy solutions with global coverage, military-grade encryption, and seamless multi-device connectivity.",
        icon: Shield,
        gradient: "from-blue-500 to-violet-600",
        glow: "rgba(99,102,241,0.15)",
        border: "hover:border-blue-500/30",
    },
    {
        title: "Sweepstakes",
        description:
            "Engaging sweepstakes platforms with real-time draws, secure entry management, and compliant prize distribution systems.",
        icon: Trophy,
        gradient: "from-amber-400 to-orange-500",
        glow: "rgba(245,158,11,0.15)",
        border: "hover:border-amber-500/30",
    },
    {
        title: "Traditional Casino",
        description:
            "Full-scale casino solutions featuring classic table games, slot mechanics, and robust player management infrastructure.",
        icon: Dice5,
        gradient: "from-emerald-400 to-teal-500",
        glow: "rgba(16,185,129,0.15)",
        border: "hover:border-emerald-500/30",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export function ProjectStack() {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                    <motion.div
                        key={cat.title}
                        variants={cardVariants}
                        className={`group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 lg:p-10 flex flex-col items-start gap-6 transition-all duration-500 ${cat.border}`}
                        style={{
                            boxShadow: `0 0 80px -20px ${cat.glow}`,
                        }}
                    >
                        {/* Background glow */}
                        <div
                            className={`absolute -top-20 -right-20 w-52 h-52 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 blur-[100px] rounded-full transition-opacity duration-700 pointer-events-none`}
                        />

                        {/* Icon */}
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg`}
                        >
                            <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                            {cat.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-blue-100/50 leading-relaxed font-light">
                            {cat.description}
                        </p>

                        {/* Subtle divider line with gradient */}
                        <div className="mt-auto w-full pt-6">
                            <div
                                className={`h-px w-full bg-gradient-to-r ${cat.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
