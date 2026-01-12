"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Globe, Laptop, Rocket, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeTypewriter } from "@/components/features/code-typewriter";
import { ProjectStack } from "@/components/features/project-stack";
import { SmartMap } from "@/components/features/smart-map";
import { TechMarquee } from "@/components/features/tech-marquee";
import dynamic from "next/dynamic";

const ThreeRubiksCube = dynamic(() => import("@/components/features/three-rubiks-cube"), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center text-purple-500/50">Loading Simulation...</div>
});

export default function Home() {
    return (
        <div className="flex flex-col gap-20 pb-20 overflow-hidden bg-[#030014]">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Visual Effects Background - Nano Banana Style */}
                <div className="absolute inset-0 -z-10 bg-[#030014]">
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[128px]" />
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-start relative z-10">
                    {/* LEFT COLUMN: Text + Terminal */}
                    <div className="space-y-10">
                        <div
                            className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                        >
                            <Zap className="mr-2 h-4 w-4 text-purple-400 fill-purple-400" />
                            Empowering Global Startup Growth
                        </div>

                        <div>
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
                                Future-Driven <br />
                                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 animate-gradient-x">
                                    <span className="text-purple-500 opacity-70 font-mono">{"{"}</span> Software <br /> Development <span className="text-purple-500 opacity-70 font-mono">{"}"}</span>
                                </span>
                            </h1>
                        </div>

                        <p
                            className="text-xl text-gray-400 max-w-[550px]"
                        >
                            Pioneering digital solutions that redefine industries and empower businesses globally.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row gap-5"
                        >
                            <Button size="lg" className="rounded-xl text-base h-14 px-8 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] border-0">
                                Explore Our Services
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-xl text-base h-14 px-8 border-purple-500/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
                                View Case Studies
                            </Button>
                        </div>

                        {/* Terminal on the Left (from Mockup) */}
                        <div
                            className="w-full max-w-lg mt-8"
                        >
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md relative z-20">
                                <CodeTypewriter />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Orb + Feature Grid */}
                    <div
                        className="relative h-full min-h-[600px] flex flex-col items-center justify-center lg:items-end lg:justify-start"
                    >

                        {/* 3D Orb Positioned behind/top */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] z-0 flex items-center justify-center pointer-events-auto">
                            {/* Optimized Three.js Rubik's Cube */}
                            <div className="w-full h-full scale-125 origin-center">
                                <ThreeRubiksCube />
                            </div>

                            {/* Floating Decorative Code Snippet - Top Right */}
                            <div className="absolute top-10 right-10 backdrop-blur-xl bg-white/5 border border-white/20 p-4 rounded-xl shadow-2xl w-64 hidden lg:block animate-float-slow">
                                <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-3/4 bg-white/20 rounded animate-pulse" />
                                    <div className="h-1.5 w-1/2 bg-white/20 rounded animate-pulse delay-75" />
                                    <div className="h-1.5 w-full bg-white/10 rounded animate-pulse delay-150" />
                                </div>
                            </div>

                            {/* Floating Decorative Status Card - Bottom Left of Orb */}
                            <div className="absolute bottom-32 left-10 backdrop-blur-xl bg-black/60 border border-purple-500/40 p-4 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.15)] w-72 hidden lg:block animate-float-delayed">
                                <div className="text-[10px] font-mono text-purple-300 mb-1 flex justify-between">
                                    <span>&gt; system_override.ts</span>
                                    <span className="text-green-400">● Active</span>
                                </div>
                                <div className="text-[10px] font-mono text-gray-300 leading-relaxed opacity-80">
                                    <span className="text-purple-400">import</span> <span className="text-yellow-300">{"{ Future }"}</span> <span className="text-purple-400">from</span> <span className="text-green-300">'@next/gen'</span>;
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Trusted By Section (Bottom of Hero) */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#030014] to-transparent pt-20 pb-10">
                    <div className="container px-4">
                        <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">Trusted by Global Leaders</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholders for logos */}
                            {["Microsoft", "Google", "Spotify", "Amazon", "Netflix"].map((brand) => (
                                <span key={brand} className="text-xl font-bold text-white/40 hover:text-white transition-colors cursor-default">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="container px-4 md:px-6 py-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Empower your product with our versatile SDK</h2>
                    <p className="text-muted-foreground">Seamlessly integrate advanced features into your app with our developer-friendly, scalable solutions.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Web Apps", icon: Laptop, desc: "High-performance React & Next.js applications tailored to your business needs." },
                        { title: "Mobile Solutions", icon: Globe, desc: "Cross-platform mobile experiences that feel native and fast." },
                        { title: "Enterprise Systems", icon: Rocket, desc: "Scalable backend architectures built secure and robust." },
                    ].map((service, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group hover:bg-white/10"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                            <p className="text-muted-foreground">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tech Marquee */}
            <section className="w-full">
                <TechMarquee />
            </section>

            {/* Project Stack Section */}
            <section className="container px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Selected Work</h2>
                <ProjectStack />
            </section>

            {/* Smart Map Section */}
            <section className="container px-4 md:px-6">
                <SmartMap />
            </section>

            {/* Final CTA */}
            <section className="container px-4 md:px-6 py-20">
                <div className="bg-gradient-to-r from-[#6d28d9] to-indigo-900 rounded-3xl p-12 text-center relative overflow-hidden border border-white/10">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start your project?</h2>
                        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                            We help companies of all sizes launch their products faster and better. Let&apos;s build something amazing together.
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-14 px-10 text-lg">
                            Contact Us <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
                </div>
            </section>
        </div>
    );
}
