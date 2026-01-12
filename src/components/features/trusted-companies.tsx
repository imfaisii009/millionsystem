"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function TrustedCompanies() {
    const logos = [
        "vertex", "novus", "echo",
        "sphere", "nexus", "core",
        "vantage", "zenith", "omni"
    ];

    return (
        <section className="relative py-32 w-full flex flex-col items-center justify-center overflow-hidden bg-[#02040a]">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-20 blur-[130px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 px-4"
                >
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-medium">Trusted by Global Leaders</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Powering Innovation at{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                            Top Companies
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Join the world's leading organizations that trust us to build their digital future
                    </p>
                </motion.div>

                {/* Marquee Section - Nano Banana Style */}
                <div className="relative w-full overflow-hidden py-10">
                    {/* Gradient Fade Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex items-center gap-16 md:gap-24 w-max"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30, // Adjust speed here
                        }}
                    >
                        {/* Duplicate lists for seamless loop */}
                        {[...logos, ...logos, ...logos].map((logo, index) => (
                            <div
                                key={index}
                                className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center group"
                            >
                                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 rounded-xl transition-colors duration-500 blur-xl" />
                                <Image
                                    src={`/logos/${logo}.png`}
                                    alt={`${logo} logo`}
                                    width={160}
                                    height={160}
                                    className="object-contain w-full h-full mix-blend-screen opacity-50 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 scale-90 group-hover:scale-110 ease-out"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-5xl mx-auto px-4"
                >
                    {[
                        { value: "500+", label: "Projects Delivered" },
                        { value: "98%", label: "Client Satisfaction" },
                        { value: "50+", label: "Team Members" },
                        { value: "15+", label: "Years Experience" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-purple-500/30 transition-colors duration-300 group"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
