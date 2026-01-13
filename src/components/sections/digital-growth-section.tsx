"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Search,
    Share2,
    Target,
    TrendingUp,
    Megaphone,
    LineChart,
    PieChart,
    MousePointerClick
} from "lucide-react";

const growthServices = [
    {
        title: "SEO Optimization",
        description: "Increase organic visibility and dominate search rankings with data-driven on-page and technical SEO.",
        icon: Search,
        features: ["Technical SEO", "Keyword Strategy", "Backlink Building"],
        gradient: "from-orange-500/20 to-yellow-500/20",
        border: "group-hover:border-orange-500/50"
    },
    {
        title: "Social Media Growth",
        description: "Build a powerful brand presence and engage your audience across all major social platforms.",
        icon: Share2,
        features: ["Content Strategy", "Community Management", "Brand Voice"],
        gradient: "from-pink-500/20 to-purple-500/20",
        border: "group-hover:border-pink-500/50"
    },
    {
        title: "Paid Advertising (PPC)",
        description: "High-conversion ad campaigns tailored to your business goals across Google, Meta, and LinkedIn.",
        icon: MousePointerClick,
        features: ["Ad Management", "A/B Testing", "ROI Optimization"],
        gradient: "from-blue-500/20 to-indigo-500/20",
        border: "group-hover:border-blue-500/50"
    },
    {
        title: "Marketing Automation",
        description: "Streamline your sales funnel with intelligent email automation and CRM integration.",
        icon: Target,
        features: ["Email Funnels", "CRM Setup", "Lead Scoring"],
        gradient: "from-emerald-500/20 to-teal-500/20",
        border: "group-hover:border-emerald-500/50"
    },
    {
        title: "Content Marketing",
        description: "Authority-building content that converts visitors into loyal customers through storytelling.",
        icon: Megaphone,
        features: ["Blog Strategy", "Copywriting", "Video Content"],
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "group-hover:border-amber-500/50"
    },
    {
        title: "Data & Analytics",
        description: "Comprehensive reporting and insights to track every metric that matters for your business growth.",
        icon: BarChart3,
        features: ["Custom Reporting", "User Behavior", "Conversion Tracking"],
        gradient: "from-cyan-500/20 to-blue-500/20",
        border: "group-hover:border-cyan-500/50"
    }
];

export function DigitalGrowthSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-[#030014]">
            {/* Nano Banana Grid Background (Marketing Variation) */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Soft Ambient Glows */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[150px] -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-20 text-right ml-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-6"
                    >
                        <TrendingUp size={14} />
                        <span>// Digital Domination</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                    >
                        Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-amber-400">Market Presence</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-zinc-400 leading-relaxed"
                    >
                        We don&apos;t just build websites; we build brands that dominate their niche.
                        Our digital growth strategies are powered by data, fueled by creativity,
                        and optimized for maximum ROI.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {growthServices.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 ${service.border}`}
                        >
                            {/* Animated Background Overlay */}
                            <div className="absolute inset-0 bg-white/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
                                    <service.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="opacity-10 group-hover:opacity-30 transition-opacity">
                                    {idx % 2 === 0 ? <LineChart size={32} /> : <PieChart size={32} />}
                                </div>
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-bold text-white mb-4">
                                {service.title}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                                {service.description}
                            </p>

                            {/* Features Tags */}
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                {service.features.map((feature, fIdx) => (
                                    <span
                                        key={fIdx}
                                        className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 group-hover:text-white/80 transition-colors"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Performance Stats Accent */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    {[
                        { label: "Client ROI", value: "340%" },
                        { label: "Search Visibility", value: "85%" },
                        { label: "Conversion Lift", value: "42%" },
                        { label: "Data Accuracy", value: "100%" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
