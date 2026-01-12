"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroCube() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] perspective-1000 flex items-center justify-center">
            {/* Outer Rotating Container */}
            <motion.div
                className="relative w-[50%] h-[50%] preserve-3d"
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    rotateZ: [0, 180]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Cube Faces */}
                {faces.map((face, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 border-2 border-primary/50 bg-primary/10 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center backface-visible ${face.className}`}
                        style={{ transform: face.transform }}
                    >
                        <div className="w-[80%] h-[80%] border border-white/20" />
                    </div>
                ))}

                {/* Inner Glowing Core */}
                <div className="absolute inset-0 flex items-center justify-center transform preserve-3d">
                    <motion.div
                        className="w-16 h-16 bg-primary rounded-full blur-xl opacity-60"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>

            {/* Floating Particles/Rings Effect */}
            <motion.div
                className="absolute inset-[-20%] border border-white/10 rounded-full"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-[-10%] border border-dashed border-primary/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

const faces = [
    { className: "front", transform: "translateZ(100px)" }, // Half of width (assuming 200px base for 50% of 400px container) -> Note: need to calibrate based on actual size. 
    // Let's use CSS variable or fixed size for simplicity. 
    // Actually, better to hardcode standard cube transforms for a known size.
    // 50% of 400px is 200px. TranslateZ should be 100px.
    { className: "back", transform: "rotateY(180deg) translateZ(100px)" },
    { className: "right", transform: "rotateY(90deg) translateZ(100px)" },
    { className: "left", transform: "rotateY(-90deg) translateZ(100px)" },
    { className: "top", transform: "rotateX(90deg) translateZ(100px)" },
    { className: "bottom", transform: "rotateX(-90deg) translateZ(100px)" },
];
