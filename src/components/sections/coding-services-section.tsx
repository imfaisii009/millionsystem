"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Code2,
    Cpu,
    Globe2,
    Layers,
    Rocket,
    Terminal,
    Workflow,
    Binary,
    Braces
} from "lucide-react";

const codingServices = [
    {
        title: "Frontend Experience",
        description: "Pixel-perfect interfaces that engage users instantly. We utilize Next.js and Framer Motion to create fluid, reactive web applications.",
        icon: Globe2,
        features: ["React / Next.js", "Server Components", "Tailwind CSS"],
        gradient: "from-blue-500/20 to-cyan-500/20",
        border: "group-hover:border-blue-500/50"
    },
    {
        title: "Backend Resilience",
        description: "Logic that never breaks. We engineer distributed systems with Node.js and Go that handle millions of requests without breaking a sweat.",
        icon: Terminal,
        features: ["Microservices", "REST / GraphQL", "Postgres / Redis"],
        gradient: "from-purple-500/20 to-pink-500/20",
        border: "group-hover:border-purple-500/50"
    },
    {
        title: "AI Integration",
        description: "Future-proof your business. We embed custom LLMs and machine learning models directly into your workflow for intelligent automation.",
        icon: Cpu,
        features: ["OpenAI / Anthropic", "Vector DBs", "Agents & RAG"],
        gradient: "from-green-500/20 to-emerald-500/20",
        border: "group-hover:border-green-500/50"
    },
    {
        title: "Legacy Modernization",
        description: "Don't let old code hold you back. We surgically refactor monolithic apps into agile, cloud-native microservices.",
        icon: Layers,
        features: ["Risk-Free Migration", "Cloud-Native", "Performance Boost"],
        gradient: "from-orange-500/20 to-yellow-500/20",
        border: "group-hover:border-orange-500/50"
    },
    {
        title: "Web3 & Blockchain",
        description: "Decentralized trust. We audit and deploy smart contracts that secure high-value transactions on the blockchain.",
        icon: Binary,
        features: ["Solidity / Rust", "Smart Contracts", "DeFi / NFT"],
        gradient: "from-indigo-500/20 to-purple-500/20",
        border: "group-hover:border-indigo-500/50"
    },
    {
        title: "DevOps & CI/CD",
        description: "Ship faster, sleep better. Our zero-downtime pipelines ensure your updates go live instantly and reliably.",
        icon: Workflow,
        features: ["Docker / K8s", "Infrastructure as Code", "Auto-Scaling"],
        gradient: "from-red-500/20 to-rose-500/20",
        border: "group-hover:border-red-500/50"
    }
];

export function CodingServicesSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-[#030014]">
            {/* Nano Banana Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Dynamic Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-6"
                    >
                        <Code2 size={14} />
                        <span>// Engineering Excellence</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                    >
                        Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Engineering</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-zinc-400 leading-relaxed"
                    >
                        We build robust, scalable, and high-performance software systems.
                        From front-end aesthetics to heavy-duty backend logic, our engineering team
                        delivers code that empowers your business to scale globally.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {codingServices.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 ${service.border}`}
                        >
                            {/* Inner Gradient Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10`} />

                            {/* Icon Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                                    <service.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                                    <Braces size={10} />
                                    <span>0{idx + 1}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">
                                {service.title}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-light">
                                {service.description}
                            </p>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                {service.features.map((feature, fIdx) => (
                                    <span
                                        key={fIdx}
                                        className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-500 font-mono"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/20 transition-colors">
                                <Rocket size={20} className="rotate-45" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Background */}
                <div className="mt-24 p-12 rounded-[2rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border border-white/10 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Ready to build your next <span className="italic text-blue-400 underline decoration-blue-400/30 underline-offset-8">engineering masterpiece?</span>
                        </h3>
                        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                            Whether it&apos;s a greenfield project or a legacy refactor,
                            our team is equipped to handle the most complex coding challenges.
                        </p>
                        <Link href="/#contact">
                            <button className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all transform active:scale-95">
                                Start Coding Project
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
