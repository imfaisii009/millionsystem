"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Code2, Smartphone, Palette, Cloud, Database, Shield, Zap } from "lucide-react";

const services = [
    {
        title: "Web Platforms",
        desc: "Scalable, high-performance web applications built for conversion.",
        icon: Code2,
        color: "text-blue-400"
    },
    {
        title: "Mobile Ecosystems",
        desc: "Native-grade iOS & Android apps that users love.",
        icon: Smartphone,
        color: "text-purple-400"
    },
    {
        title: "Strategic UI/UX",
        desc: "Data-driven design that guides user behavior.",
        icon: Palette,
        color: "text-pink-400"
    },
    {
        title: "Cloud Architecture",
        desc: "Serverless, resilient infrastructure that scales with you.",
        icon: Cloud,
        color: "text-indigo-400"
    },
    {
        title: "Backend Core",
        desc: "The invisible engine powering your business logic.",
        icon: Database,
        color: "text-blue-500"
    },
    {
        title: "Cyber Security",
        desc: "Fortress-level protection for your digital assets.",
        icon: Shield,
        color: "text-emerald-400"
    }
];

const benefits = [
    "Elite Engineering Team (Top 1% Talent)",
    "Rapid Prototyping & Agile Delivery",
    "Enterprise-Grade Security Standards",
    "Dedicated 24/7 Technical Support",
    "Future-Proof Tech Stack (Next.js, AI)",
    "Proven ROI-Driven Methodology"
];

export function AboutHaysSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                {/* 1. About Section */}
                <div className="max-w-4xl mx-auto text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">MillionSystems</span> Standard
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
                            We are not just developers; we are strategic partners in your digital evolution.
                            MillionSystems blends elite engineering with creative vision to build products
                            that don't just function—they dominate markets.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Mission & Why Choose Us */}
                    <div className="space-y-20">
                        {/* 2. Our Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative">
                                <h3 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                                    <Zap className="text-purple-400 w-8 h-8" />
                                    Our Mission
                                </h3>
                                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                                    To empower ambitious businesses with technology that breaks barriers.
                                    We believe in code that cleans up complexity and design that
                                    clarifies purpose.
                                    <span className="block mt-4 text-purple-300 font-medium italic">Building the infrastructure of your success.</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* 3. Why Choose Us */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-3xl font-bold mb-8 text-white">The Competitive Edge</h3>
                            <div className="grid sm:grid-cols-1 gap-4">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500 group-hover:border-purple-500 transition-all duration-300">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-zinc-300 group-hover:text-white transition-colors text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Services Grid (Nano Banana Style) */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                                    {service.title}
                                </h4>
                                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                                    {service.desc}
                                </p>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
