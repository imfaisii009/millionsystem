"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
import { Shuffle, RotateCcw, Sparkles } from "lucide-react";

const CUBE_SIZE = 1;
const SPACING = 0.05;
const TOTAL_SIZE = CUBE_SIZE + SPACING;

const COLORS = {
    base: 0x18181b,
    R: 0xef4444,
    L: 0xf97316,
    U: 0xffffff,
    D: 0xeab308,
    F: 0x22c55e,
    B: 0x3b82f6
};

export default function ThreeRubiksCube() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [canSolve, setCanSolve] = useState(false);

    // All mutable state in refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cubesRef = useRef<THREE.Mesh[]>([]);
    const pivotRef = useRef(new THREE.Object3D());
    const moveHistoryRef = useRef<{ axis: string; index: number; dir: number }[]>([]);
    const moveQueueRef = useRef<{ axis: string; index: number; dir: number; duration: number; isSolving: boolean }[]>([]);
    const isAnimatingRef = useRef(false);
    const frameIdRef = useRef<number>(0);

    // TWEEN group for managing animations (required in v25+)
    const tweenGroupRef = useRef<Group>(new Group());

    // Store processQueue in ref for external access
    const processQueueRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !mountRef.current) return;

        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(6, 4, 6);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(5, 12, 8);
        scene.add(dirLight);

        const rimLight = new THREE.SpotLight(0x8b5cf6, 10);
        rimLight.position.set(-10, 5, -5);
        rimLight.lookAt(0, 0, 0);
        scene.add(rimLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 1);
        fillLight.position.set(-10, -8, 5);
        scene.add(fillLight);

        // Pivot
        scene.add(pivotRef.current);

        // Create plastic texture
        const createPlasticNoiseTexture = () => {
            const size = 512;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return new THREE.Texture();

            ctx.fillStyle = "#808080";
            ctx.fillRect(0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const grain = (Math.random() - 0.5) * 20;
                data[i] += grain;
                data[i + 1] += grain;
                data[i + 2] += grain;
            }
            ctx.putImageData(imageData, 0, 0);
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            return texture;
        };

        // Create Rubik's Cube
        const createRubiksCube = () => {
            const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
            const plasticTexture = createPlasticNoiseTexture();
            const plasticProps = {
                roughness: 0.65,
                metalness: 0.0,
                clearcoat: 1.0,
                clearcoatRoughness: 0.15,
                reflectivity: 0.5,
                bumpMap: plasticTexture,
                bumpScale: 0.008
            };

            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    for (let z = -1; z <= 1; z++) {
                        const materials = [
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: x === 1 ? COLORS.R : COLORS.base }),
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: x === -1 ? COLORS.L : COLORS.base }),
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: y === 1 ? COLORS.U : COLORS.base }),
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: y === -1 ? COLORS.D : COLORS.base }),
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: z === 1 ? COLORS.F : COLORS.base }),
                            new THREE.MeshPhysicalMaterial({ ...plasticProps, color: z === -1 ? COLORS.B : COLORS.base }),
                        ];

                        const cube = new THREE.Mesh(geometry, materials);
                        cube.position.set(x * TOTAL_SIZE, y * TOTAL_SIZE, z * TOTAL_SIZE);
                        cube.castShadow = true;
                        cube.receiveShadow = true;
                        cube.userData = { x, y, z };

                        scene.add(cube);
                        cubesRef.current.push(cube);
                    }
                }
            }
        };

        // Update UI state
        const updateUI = () => {
            setCanSolve(moveHistoryRef.current.length > 0);
        };

        // Process queue
        const processQueue = () => {
            if (!isAnimatingRef.current && moveQueueRef.current.length > 0) {
                const move = moveQueueRef.current.shift()!;
                rotateLayer(move.axis, move.index, move.dir, move.duration, move.isSolving);
            }
        };

        // Rotate layer
        const rotateLayer = (axis: string, index: number, dir: number, duration = 300, isSolving = false) => {
            if (isAnimatingRef.current && duration > 0) return;
            isAnimatingRef.current = true;

            const activeCubes = cubesRef.current.filter(c =>
                Math.abs((c.position as any)[axis] - index * TOTAL_SIZE) < 0.1
            );

            pivotRef.current.rotation.set(0, 0, 0);
            pivotRef.current.position.set(0, 0, 0);

            activeCubes.forEach(cube => {
                pivotRef.current.attach(cube);
            });

            const targetRotation = { value: 0 };
            const finalRotation = (Math.PI / 2) * dir * -1;

            new Tween(targetRotation, tweenGroupRef.current)
                .to({ value: finalRotation }, duration)
                .easing(Easing.Quadratic.InOut)
                .onUpdate(() => {
                    (pivotRef.current.rotation as any)[axis] = targetRotation.value;
                })
                .onComplete(() => {
                    pivotRef.current.updateMatrixWorld();
                    activeCubes.forEach(cube => {
                        scene.attach(cube);
                        cube.position.x = Math.round(cube.position.x / TOTAL_SIZE) * TOTAL_SIZE;
                        cube.position.y = Math.round(cube.position.y / TOTAL_SIZE) * TOTAL_SIZE;
                        cube.position.z = Math.round(cube.position.z / TOTAL_SIZE) * TOTAL_SIZE;

                        cube.rotation.x = Math.round(cube.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
                        cube.rotation.y = Math.round(cube.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
                        cube.rotation.z = Math.round(cube.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
                        cube.updateMatrix();
                    });

                    pivotRef.current.rotation.set(0, 0, 0);
                    isAnimatingRef.current = false;

                    if (!isSolving) {
                        moveHistoryRef.current.push({ axis, index, dir });
                        updateUI();
                    }

                    if (moveQueueRef.current.length > 0) {
                        const nextMove = moveQueueRef.current.shift()!;
                        rotateLayer(nextMove.axis, nextMove.index, nextMove.dir, nextMove.duration, nextMove.isSolving);
                    } else if (isSolving && moveHistoryRef.current.length === 0) {
                        updateUI();
                    }
                })
                .start();
        };

        // Store processQueue in ref for external access
        processQueueRef.current = processQueue;

        // Create cube
        createRubiksCube();

        // Camera auto-rotation angle
        let cameraAngle = 0;
        const cameraRadius = 9;
        const cameraHeight = 4;

        // Animation loop with auto-rotating camera view
        const animate = (time: number) => {
            frameIdRef.current = requestAnimationFrame(animate);
            tweenGroupRef.current.update(time);

            // Auto-rotate camera around the cube
            cameraAngle += 0.003;
            camera.position.x = Math.cos(cameraAngle) * cameraRadius;
            camera.position.z = Math.sin(cameraAngle) * cameraRadius;
            camera.position.y = cameraHeight + Math.sin(cameraAngle * 0.5) * 1.5;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate(0);

        // Initial scramble after 1 second
        setTimeout(() => {
            if (isAnimatingRef.current || moveQueueRef.current.length > 0) return;
            const axes = ["x", "y", "z"];
            for (let i = 0; i < 5; i++) {
                const axis = axes[Math.floor(Math.random() * axes.length)];
                const index = Math.floor(Math.random() * 3) - 1;
                const dir = Math.random() > 0.5 ? 1 : -1;
                moveQueueRef.current.push({ axis, index, dir, duration: 100, isSolving: false });
            }
            processQueue();
        }, 1000);

        // Resize handler
        const handleResize = () => {
            if (!container || !cameraRef.current || !rendererRef.current) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameIdRef.current);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                try {
                    container.removeChild(renderer.domElement);
                } catch (e) { }
            }
        };
    }, [mounted]);

    // Scramble handler
    const handleScramble = useCallback(() => {
        if (isAnimatingRef.current || moveQueueRef.current.length > 0) return;

        const axes = ["x", "y", "z"];
        for (let i = 0; i < 20; i++) {
            const axis = axes[Math.floor(Math.random() * axes.length)];
            const index = Math.floor(Math.random() * 3) - 1;
            const dir = Math.random() > 0.5 ? 1 : -1;
            moveQueueRef.current.push({ axis, index, dir, duration: 100, isSolving: false });
        }
        processQueueRef.current?.();
    }, []);

    // Solve handler
    const handleSolve = useCallback(() => {
        if (isAnimatingRef.current || moveQueueRef.current.length > 0 || moveHistoryRef.current.length === 0) return;

        const history = [...moveHistoryRef.current];
        moveHistoryRef.current = [];
        setCanSolve(false);

        history.reverse().forEach(move => {
            moveQueueRef.current.push({
                axis: move.axis,
                index: move.index,
                dir: move.dir * -1,
                duration: 150,
                isSolving: true
            });
        });
        processQueueRef.current?.();
    }, []);

    // Reset handler
    const handleReset = useCallback(() => {
        if (isAnimatingRef.current) return;
        if (!sceneRef.current) return;

        // Clear queue and history
        moveQueueRef.current.length = 0;
        moveHistoryRef.current = [];

        // Remove existing cubes
        cubesRef.current.forEach(cube => {
            sceneRef.current?.remove(cube);
            cube.geometry.dispose();
            if (Array.isArray(cube.material)) {
                cube.material.forEach(m => m.dispose());
            }
        });
        cubesRef.current = [];

        // Recreate cube
        const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

        const createPlasticNoiseTexture = () => {
            const size = 512;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return new THREE.Texture();
            ctx.fillStyle = "#808080";
            ctx.fillRect(0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const grain = (Math.random() - 0.5) * 20;
                data[i] += grain;
                data[i + 1] += grain;
                data[i + 2] += grain;
            }
            ctx.putImageData(imageData, 0, 0);
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            return texture;
        };

        const plasticTexture = createPlasticNoiseTexture();
        const plasticProps = {
            roughness: 0.65,
            metalness: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.15,
            reflectivity: 0.5,
            bumpMap: plasticTexture,
            bumpScale: 0.008
        };

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const materials = [
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: x === 1 ? COLORS.R : COLORS.base }),
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: x === -1 ? COLORS.L : COLORS.base }),
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: y === 1 ? COLORS.U : COLORS.base }),
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: y === -1 ? COLORS.D : COLORS.base }),
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: z === 1 ? COLORS.F : COLORS.base }),
                        new THREE.MeshPhysicalMaterial({ ...plasticProps, color: z === -1 ? COLORS.B : COLORS.base }),
                    ];

                    const cube = new THREE.Mesh(geometry, materials);
                    cube.position.set(x * TOTAL_SIZE, y * TOTAL_SIZE, z * TOTAL_SIZE);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    cube.userData = { x, y, z };

                    sceneRef.current!.add(cube);
                    cubesRef.current.push(cube);
                }
            }
        }

        setCanSolve(false);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center text-purple-500/30">
                Loading 3D...
            </div>
        );
    }

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 z-10" />

            {/* UI Overlay */}
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-4 z-50 pointer-events-none">
                {/* Controls */}
                <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                        type="button"
                        onClick={handleScramble}
                        className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1 min-w-[60px]"
                    >
                        <Shuffle size={18} />
                        <span className="text-[10px] font-medium">Scramble</span>
                    </button>

                    <div className="w-px bg-white/10 my-1" />

                    <button
                        type="button"
                        disabled={!canSolve}
                        onClick={handleSolve}
                        className={`p-3 rounded-xl hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors flex flex-col items-center gap-1 min-w-[60px] ${!canSolve ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Sparkles size={18} />
                        <span className="text-[10px] font-medium">Solve</span>
                    </button>

                    <div className="w-px bg-white/10 my-1" />

                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1 min-w-[60px]"
                    >
                        <RotateCcw size={18} />
                        <span className="text-[10px] font-medium">Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
