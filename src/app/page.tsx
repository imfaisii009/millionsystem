"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Globe, Laptop, Rocket, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ProjectStack } from "@/components/features/project-stack";
import { SmartMap } from "@/components/features/smart-map";
import { TechMarquee } from "@/components/features/tech-marquee";
import { SDKShowcase } from "@/components/features/sdk-showcase";
import { TrustedCompanies } from "@/components/features/trusted-companies";
import { ContactSection } from "@/components/sections/contact-section";
import { AboutHaysSection } from "@/components/sections/about-hays-section";
import { CodingServicesSection } from "@/components/sections/coding-services-section";
import { DigitalGrowthSection } from "@/components/sections/digital-growth-section";
import { TestimonialDataStream } from "@/components/sections/testimonial-data-stream";
import dynamic from "next/dynamic";

const ThreeRubiksCube = dynamic(() => import("@/components/features/three-rubiks-cube"), {
    ssr: false,
    loading: () => <div className="w-full h-[500px]" />
});

export default function Home() {
    return (
        <div className="flex flex-col gap-20 pb-20 overflow-hidden bg-[#030014]">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Visual Effects Background - Nano Banana Style */}
                <div className="absolute inset-0 -z-10 bg-[#030014]">
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[128px]" />
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                {/* Floating Decorative Code Blocks - Background (Visible only on large screens to prevent overlap) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Floating Decorative Code Snippet - neural_net.config (Positioned in top-center gap) */}
                    <div className="hidden xl:block absolute top-[12%] left-[42%] scale-90 backdrop-blur-xl bg-white/5 border border-white/20 p-4 rounded-xl shadow-2xl w-64 animate-float-slow opacity-50">
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <div className="text-[10px] font-mono text-blue-300 mb-1 flex justify-between">
                            <span>&gt; neural_net.config</span>
                            <span className="text-blue-400">● Ready</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-300 leading-relaxed opacity-80">
                            <span className="text-purple-400">const</span> <span className="text-yellow-300">engine</span> <span className="text-white">=</span> <span className="text-purple-400">await</span> <span className="text-green-300">start()</span>;
                        </div>
                    </div>

                    {/* Floating Decorative Status Card - system_override.ts (Bottom center area) */}
                    <div className="hidden xl:block absolute bottom-[25%] left-[38%] scale-90 backdrop-blur-xl bg-white/5 border border-purple-500/30 p-4 rounded-xl shadow-2xl w-64 animate-float-slow opacity-50" style={{ animationDelay: '2s' }}>
                        <div className="text-[10px] font-mono text-purple-300 mb-1 flex justify-between">
                            <span>&gt; system_override.ts</span>
                            <span className="text-green-400">● Active</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-300 leading-relaxed opacity-80">
                            <span className="text-purple-400">import</span> <span className="text-yellow-300">{"{ Future }"}</span> <span className="text-purple-400">from</span> <span className="text-green-300">&apos;@next/gen&apos;</span>;
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* LEFT COLUMN: Text + Cube (mobile) + Terminal */}
                    <div className="space-y-10 order-1 relative">
                        <div
                            className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                        >
                            <Zap className="mr-2 h-4 w-4 text-purple-400 fill-purple-400" />
                            Empowering Global Startup Growth
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[1.1] text-white">
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
                            <Link href="/#services">
                                <Button size="lg" className="rounded-xl text-base h-14 px-8 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] border-0">
                                    Explore Our Services
                                </Button>
                            </Link>
                            <Link href="/#portfolio">
                                <Button size="lg" variant="outline" className="rounded-xl text-base h-14 px-8 border-purple-500/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
                                    View Case Studies
                                </Button>
                            </Link>
                        </div>


                        {/* Rubik's Cube - Mobile Only (shows after buttons) */}
                        <div className="lg:hidden w-full h-[500px] relative">
                            <ThreeRubiksCube />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Rubik's Cube - Desktop Only */}
                    <div
                        className="relative h-full min-h-[600px] hidden lg:flex flex-col items-center justify-center order-2"
                    >
                        {/* 3D Rubik's Cube */}
                        <div className="w-full h-[600px] lg:h-[700px] flex items-center justify-center xl:justify-end">
                            <div className="w-full h-full scale-110 xl:scale-125 origin-center">
                                <ThreeRubiksCube />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Main Container */}
            <div id="services">
                {/* About & Services Section - Nano Banana Style */}
                <AboutHaysSection />

                {/* Coding Services Section - Nano Banana Style */}
                <CodingServicesSection />

                {/* Digital Growth Section - Nano Banana Style */}
                <DigitalGrowthSection />
            </div>

            {/* Tech Marquee - Section 2 */}
            <section className="w-full">
                <TechMarquee />
            </section>

            {/* SDK Showcase - Section 3 */}
            <SDKShowcase />

            {/* Trusted Companies - Section 4 */}
            <TrustedCompanies />

            {/* Project Stack Section - Section 5 */}
            <section id="portfolio" className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Selected Work</h2>
                <ProjectStack />
            </section>

            {/* Smart Map Section - Section 7 */}
            <section className="container mx-auto px-4 md:px-6">
                <SmartMap />
            </section>

            {/* Testimonials Section - Nano Banana Style */}
            <TestimonialDataStream />

            {/* Contact Section - Section 8 */}
            <ContactSection />
        </div>
    );
}
