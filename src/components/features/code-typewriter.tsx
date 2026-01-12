"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { Terminal, Maximize2, Minus, X } from "lucide-react";

const codeSnippet = `// Initializing Next-Gen Ecosystem...
const future = new Millionsystem();

await future.innovate({
  target: "Global Market",
  performance: "Optimized",
  security: "Quantum-Ready"
});

// Deploying Solution...
return "🚀 Launch Successful";`;

export function CodeTypewriter() {
    const [displayedCode, setDisplayedCode] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < codeSnippet.length) {
            const timeout = setTimeout(() => {
                setDisplayedCode((prev) => prev + codeSnippet[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 30 + Math.random() * 30); // Random typing speed

            return () => clearTimeout(timeout);
        }
    }, [currentIndex]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-white/10 w-full max-w-lg mx-auto"
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-mono">dev@millionsystem:~/project</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Minus className="w-3 h-3 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-3 h-3 hover:text-white cursor-pointer" />
                    <X className="w-3 h-3 hover:text-red-500 cursor-pointer" />
                </div>
            </div>

            {/* Code Area */}
            <div className="p-4 relative min-h-[300px]">
                <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{
                        background: "transparent",
                        margin: 0,
                        padding: 0,
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                    }}
                    wrapLines={true}
                >
                    {displayedCode}
                </SyntaxHighlighter>

                {/* Blinking Cursor */}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
                />
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        </motion.div>
    );
}
