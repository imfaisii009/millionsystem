"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";
import { Shuffle, RotateCcw, Play, CheckCircle } from "lucide-react";

const COLORS = {
    base: 0x18181b, // Zinc 900
    R: 0xef4444,    // Red
    L: 0xf97316,    // Orange
    U: 0xffffff,    // White
    D: 0xeab308,    // Yellow
    F: 0x22c55e,    // Green
    B: 0x3b82f6     // Blue
};

export default function ThreeRubiksCube() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [moveCount, setMoveCount] = useState(0);
    const [isSolving, setIsSolving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Use refs for Three.js objects to avoid re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const cubesRef = useRef<THREE.Mesh[]>([]);
    const pivotRef = useRef<THREE.Object3D>(new THREE.Object3D());
    const moveHistoryRef = useRef<{ axis: string, index: number, dir: number }[]>([]);
    const moveQueueRef = useRef<any[]>([]);
    const isAnimatingRef = useRef(false);
    const frameIdRef = useRef<number>(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !mountRef.current) return;

        // --- INIT SCENE ---
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(6, 4, 6);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        // Clear and append
        const container = mountRef.current;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- LIGHTING ---
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

        // --- CONTROLS ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 4;
        controls.maxDistance = 15;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 3.0;
        controlsRef.current = controls;

        // --- CREATE CUBE ---
        createRubiksCube(scene);
        scene.add(pivotRef.current);

        // --- ANIMATION ---
        const animate = (time: number) => {
            frameIdRef.current = requestAnimationFrame(animate);
            TWEEN.update(time);
            controls.update();
            renderer.render(scene, camera);
        };
        animate(0);

        // --- RESIZE ---
        const handleResize = () => {
            if (!container || !cameraRef.current || !rendererRef.current) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        // Initial Scramble
        setTimeout(() => handleScramble(), 1000);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameIdRef.current);
            controls.dispose();

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                try { container.removeChild(renderer.domElement); } catch (e) { }
            }
        };
    }, [mounted]);

    // --- LOGIC ---
    const createPlasticNoiseTexture = () => {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Texture();

        ctx.fillStyle = '#808080';
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

    const createRubiksCube = (scene: THREE.Scene) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const plasticTexture = createPlasticNoiseTexture();
        const plasticProps = {
            roughness: 0.6,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 0.5,
            bumpMap: plasticTexture,
            bumpScale: 0.005
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
                    cube.position.set(x * 1.05, y * 1.05, z * 1.05);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    cube.userData = { x, y, z };
                    scene.add(cube);
                    cubesRef.current.push(cube);
                }
            }
        }
    };

    const rotateLayer = (axis: string, index: number, dir: number, duration = 300, isSolvingMove = false, updateState = true) => {
        if (isAnimatingRef.current && duration > 0) return;
        isAnimatingRef.current = true;

        const activeCubes = cubesRef.current.filter(c => {
            // @ts-ignore
            return Math.abs(c.position[axis] - (index * 1.05)) < 0.1
        });

        pivotRef.current.rotation.set(0, 0, 0);
        pivotRef.current.position.set(0, 0, 0);
        activeCubes.forEach(c => pivotRef.current.attach(c));

        const targetAndState = { value: 0 };
        const finalRot = (Math.PI / 2) * dir * -1;

        new TWEEN.Tween(targetAndState)
            .to({ value: finalRot }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                // @ts-ignore
                pivotRef.current.rotation[axis] = targetAndState.value;
            })
            .onComplete(() => {
                pivotRef.current.updateMatrixWorld();
                activeCubes.forEach(c => {
                    sceneRef.current?.attach(c);
                    c.position.x = Math.round(c.position.x / 1.05) * 1.05;
                    c.position.y = Math.round(c.position.y / 1.05) * 1.05;
                    c.position.z = Math.round(c.position.z / 1.05) * 1.05;
                    c.rotation.x = Math.round(c.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
                    c.rotation.y = Math.round(c.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
                    c.rotation.z = Math.round(c.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
                    c.updateMatrix();
                });
                pivotRef.current.rotation.set(0, 0, 0);
                isAnimatingRef.current = false;

                if (!isSolvingMove) {
                    moveHistoryRef.current.push({ axis, index, dir });
                    if (updateState) {
                        setMoveCount(c => c + 1);
                    }
                }

                processQueue();
            })
            .start();
    };

    const processQueue = () => {
        if (!isAnimatingRef.current && moveQueueRef.current.length > 0) {
            const move = moveQueueRef.current.shift();
            rotateLayer(move.axis, move.index, move.dir, move.duration, move.isSolving, move.updateState);
        } else if (moveQueueRef.current.length === 0 && isSolving) {
            setToastMessage("Cube Solved!");
            setTimeout(() => setToastMessage(null), 3000);
            setIsSolving(false);
            setMoveCount(0);
        }
    };

    const handleScramble = (count = 15) => {
        console.log("Scramble Triggered");
        if (isAnimatingRef.current) return;

        // Optimistically update move count so UI enables immediately
        setMoveCount(c => c + count);

        const axes = ['x', 'y', 'z'];
        for (let i = 0; i < count; i++) {
            const axis = axes[Math.floor(Math.random() * axes.length)];
            const index = Math.floor(Math.random() * 3) - 1;
            const dir = Math.random() > 0.5 ? 1 : -1;
            // Don't update state individually per move, we did it in bulk
            moveQueueRef.current.push({ axis, index, dir, duration: 100, isSolving: false, updateState: false });
        }
        processQueue();
    };

    const handleSolve = () => {
        console.log("Solve Triggered");
        if (isAnimatingRef.current || moveHistoryRef.current.length === 0) return;
        setIsSolving(true);
        const history = [...moveHistoryRef.current];
        moveHistoryRef.current = [];
        history.reverse().forEach(move => {
            moveQueueRef.current.push({
                axis: move.axis,
                index: move.index,
                dir: move.dir * -1,
                duration: 150,
                isSolving: true
            });
        });
        processQueue();
    };

    const handleResetCamera = () => {
        if (!cameraRef.current || !controlsRef.current) return;
        new TWEEN.Tween(cameraRef.current.position)
            .to({ x: 6, y: 4, z: 6 }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
        new TWEEN.Tween(controlsRef.current.target)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    };

    if (!mounted) return <div className="w-full h-[500px] flex items-center justify-center text-purple-500/30">Init 3D Module...</div>;

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

            {/* UI Overlay - Z-50 to force clickable */}
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-4 z-50 pointer-events-none">

                {/* Controls */}
                <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                        id="rubiks-scramble"
                        type="button"
                        onClick={() => handleScramble()}
                        className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1 min-w-[60px] cursor-pointer relative z-50 overflow-visible"
                    >
                        <Shuffle size={18} />
                        <span className="text-[10px] font-medium">Scramble</span>
                    </button>
                    <div className="w-px bg-white/10 my-1" />
                    <button
                        id="rubiks-solve"
                        type="button"
                        disabled={moveCount === 0 || isSolving}
                        onClick={handleSolve}
                        className={`p-3 rounded-xl hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors flex flex-col items-center gap-1 min-w-[60px] cursor-pointer relative z-50 overflow-visible ${moveCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Play size={18} />
                        <span className="text-[10px] font-medium">Solve</span>
                    </button>
                    <div className="w-px bg-white/10 my-1" />
                    <button
                        id="rubiks-reset"
                        type="button"
                        onClick={handleResetCamera}
                        className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1 min-w-[60px] cursor-pointer relative z-50 overflow-visible"
                    >
                        <RotateCcw size={18} />
                        <span className="text-[10px] font-medium">Reset</span>
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-5 z-50">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-sm font-medium text-white">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
