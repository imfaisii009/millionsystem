"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Code2, Copy, Check, Database } from "lucide-react";
import {
    SiNodedotjs,
    SiVercel,
    SiDeno,
    SiCloudflare,
    SiPython,
    SiGo,
    SiRuby,
    SiPhp,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { IQQuizCompact } from "./iq-quiz-compact";
import { CODE_SNIPPETS } from "@/lib/constants/sdk-code-snippets";

// Framework icons mapping
const FRAMEWORK_ICONS: Record<string, React.ReactNode> = {
    nodejs: <SiNodedotjs className="w-4 h-4" />,
    vercel: <SiVercel className="w-4 h-4" />,
    supabase: <Database className="w-4 h-4" />,
    deno: <SiDeno className="w-4 h-4" />,
    cloudflare: <SiCloudflare className="w-4 h-4" />,
    lambda: <FaAws className="w-4 h-4" />,
    python: <SiPython className="w-4 h-4" />,
    go: <SiGo className="w-4 h-4" />,
    ruby: <SiRuby className="w-4 h-4" />,
    php: <SiPhp className="w-4 h-4" />,
};

export function SDKShowcase() {
    const [activeTab, setActiveTab] = useState("nodejs");
    const [copied, setCopied] = useState(false);

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy code");
        }
    };

    const activeSnippet = CODE_SNIPPETS.find(s => s.id === activeTab);

    return (
        <section className="relative py-24 w-full bg-[#02040a]" id="sdk-showcase">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-40 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-30 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">Developer Experience</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Integrate in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Minutes
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Copy-paste ready code examples for your favorite framework.
                        Our IQ Quiz API is free and public - try it live!
                    </p>
                </motion.div>

                {/* Two-column layout - Code Left, Quiz Right */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                    {/* Left: Code Tabs - Takes remaining space */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:flex-1 min-w-0"
                    >
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {CODE_SNIPPETS.map((snippet) => (
                                <button
                                    key={snippet.id}
                                    onClick={() => setActiveTab(snippet.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === snippet.id
                                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 border'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 border'
                                        }`}
                                >
                                    {FRAMEWORK_ICONS[snippet.id]}
                                    <span className="hidden sm:inline">{snippet.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Code Display */}
                        {activeSnippet && (
                            <div className="rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/10 shadow-2xl">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {activeSnippet.label.toLowerCase().replace(/\s+/g, '-')}.{activeSnippet.language === 'javascript' ? 'js' : activeSnippet.language === 'typescript' ? 'ts' : activeSnippet.language}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(activeSnippet.code)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-400 hover:text-white"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-green-500">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Code Block */}
                                <div className="p-4 overflow-x-auto max-h-[450px] overflow-y-auto">
                                    <SyntaxHighlighter
                                        language={activeSnippet.language}
                                        style={vscDarkPlus}
                                        customStyle={{
                                            background: "transparent",
                                            margin: 0,
                                            padding: 0,
                                            fontSize: "0.85rem",
                                            lineHeight: "1.6",
                                        }}
                                        showLineNumbers
                                        lineNumberStyle={{
                                            minWidth: "2.5em",
                                            paddingRight: "1em",
                                            color: "#4a5568",
                                            userSelect: "none",
                                        }}
                                    >
                                        {activeSnippet.code}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}

                    </motion.div>

                    {/* Right: Compact Quiz Demo - Fixed width, vertically centered */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[400px] lg:flex-shrink-0 flex flex-col justify-center"
                    >
                        <div className="text-center mb-3">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Live Demo</span>
                        </div>
                        <IQQuizCompact />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
