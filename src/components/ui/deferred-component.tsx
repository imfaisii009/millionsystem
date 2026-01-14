"use client";

import { useState, useEffect, useRef, ComponentType, Suspense, lazy } from "react";

interface DeferredComponentProps {
    importFn: () => Promise<{ default: ComponentType<unknown> }>;
    fallback?: React.ReactNode;
    rootMargin?: string;
    delay?: number;
}

export function DeferredComponent({
    importFn,
    fallback = null,
    rootMargin = "200px",
    delay = 0,
}: DeferredComponentProps) {
    const [Component, setComponent] = useState<ComponentType<unknown> | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [rootMargin]);

    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            importFn().then(mod => {
                setComponent(() => mod.default);
            });
        }, delay);

        return () => clearTimeout(timer);
    }, [isVisible, importFn, delay]);

    return (
        <div ref={containerRef}>
            {Component ? <Component /> : fallback}
        </div>
    );
}
