"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { RotateCcw, Shuffle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

// Vivid Neon Colors
const COLORS = {
    U: "#ffffff", // Up - White
    D: "#fbbf24", // Down - Yellow (Amber-400)
    F: "#8b5cf6", // Front - Violet (Violet-500)
    B: "#3b82f6", // Back - Blue (Blue-500)
    L: "#ec4899", // Left - Pink (Pink-500)
    R: "#06b6d4", // Right - Cyan (Cyan-500)
    CORE: "#000000",
};

// Types
type Axis = "x" | "y" | "z";
type Direction = 1 | -1;

export function InteractiveRubiksCube() {
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isScrambling, setIsScrambling] = useState(false);

    // Rotation State
    const [rotation, setRotation] = useState({ x: -25, y: -45 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Mouse Handlers for 3D Orbit
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsAutoRotating(false);
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        setRotation(prev => ({
            x: prev.x - deltaY * 0.5, // Invert Y for natural feel
            y: prev.y + deltaX * 0.5
        }));

        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Attach global event listeners for drag release outside component
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mousemove', handleMouseMove as any);
        } else {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove as any);
        }
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove as any);
        }
    }, [isDragging]);

    return (
        <div
            className="relative flex flex-col items-center justify-center p-10 perspective-1000 group cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
        >
            {/* 3D Cube Container */}
            <div className="relative w-[240px] h-[240px] preserve-3d">
                <CubeModel
                    rotation={rotation}
                    isAutoRotating={isAutoRotating}
                    isScrambling={isScrambling}
                />
            </div>

            {/* Lighting/Platform Effect */}
            <div className="absolute bottom-[-100px] w-40 h-10 bg-purple-500/20 rounded-[100%] blur-3xl pointer-events-none" />

            {/* Controls Overlay */}
            <div
                className="absolute -bottom-20 flex gap-4 backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 z-50"
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking buttons
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className="hover:bg-purple-500/20 text-white"
                    title={isAutoRotating ? "Pause Rotation" : "Auto Rotate"}
                >
                    {isAutoRotating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsScrambling(true)}
                    disabled={isScrambling}
                    className="hover:bg-purple-500/20 text-white"
                    title="Scramble"
                >
                    <Shuffle className="w-5 h-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setIsScrambling(false);
                        setRotation({ x: -25, y: -45 }); // Reset View too
                    }}
                    className="hover:bg-purple-500/20 text-white"
                    title="Reset / Solve"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}

function CubeModel({ rotation, isAutoRotating, isScrambling }: { rotation: { x: number, y: number }, isAutoRotating: boolean, isScrambling: boolean }) {
    // Generates 27 cubies
    const cubies = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                cubies.push({ x, y, z });
            }
        }
    }

    return (
        <motion.div
            className="w-full h-full preserve-3d relative"
            animate={{
                rotateX: isAutoRotating ? [rotation.x, rotation.x + 360] : rotation.x,
                rotateY: isAutoRotating ? [rotation.y, rotation.y + 360] : rotation.y,
            }}
            transition={{
                rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
            style={{ transformStyle: "preserve-3d" }}
        >
            {cubies.map((pos, i) => (
                <Cubie
                    key={i}
                    position={pos}
                    isScrambling={isScrambling}
                    index={i}
                />
            ))}
        </motion.div>
    );
}

function Cubie({ position, isScrambling, index }: { position: { x: number, y: number, z: number }, isScrambling: boolean, index: number }) {
    // Calculate initial transform based on position (x, y, z)
    // Scale: 240px container / 3 = 80px per cubie
    const size = 80;
    const gap = 2; // subtle gap
    const x = position.x * (size + gap);
    const y = position.y * (size + gap);
    const z = position.z * (size + gap);

    // Random rotation for scramble effect
    const randomRotate = isScrambling ? {
        rotateX: Math.floor(Math.random() * 4) * 90,
        rotateY: Math.floor(Math.random() * 4) * 90,
        rotateZ: Math.floor(Math.random() * 4) * 90,
    } : { rotateX: 0, rotateY: 0, rotateZ: 0 };

    return (
        <motion.div
            className="absolute w-[80px] h-[80px] preserve-3d"
            style={{
                transformOrigin: "center center",
                left: "50%",
                top: "50%",
                marginLeft: "-40px",
                marginTop: "-40px",
                // We use calculate transform in style to be base
                // Animation overrides it
            }}
            initial={{ x, y, z }}
            animate={{
                x, y, z,
                ...randomRotate
            }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: isScrambling ? index * 0.02 : 0 }}
        >
            {/* Faces */}
            <Face type="front" color={COLORS.F} translate="translateZ(40px)" />
            <Face type="back" color={COLORS.B} translate="rotateY(180deg) translateZ(40px)" />
            <Face type="right" color={COLORS.R} translate="rotateY(90deg) translateZ(40px)" />
            <Face type="left" color={COLORS.L} translate="rotateY(-90deg) translateZ(40px)" />
            <Face type="top" color={COLORS.U} translate="rotateX(90deg) translateZ(40px)" />
            <Face type="bottom" color={COLORS.D} translate="rotateX(-90deg) translateZ(40px)" />
        </motion.div>
    )
}

function Face({ type, color, translate }: { type: string, color: string, translate: string }) {
    return (
        <div
            className="absolute inset-0 border-2 border-black/80 rounded-md flex items-center justify-center backface-hidden"
            style={{
                backgroundColor: color,
                transform: translate,
                boxShadow: `inset 0 0 8px rgba(0,0,0,0.25)`
            }}
        >
            {/* Removed inner dimming div for max brightness */}
        </div>
    )
}
