"use client";

import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
    className?: string;
}

export function LazySection({
    children,
    fallback = null,
    rootMargin = "200px",
    threshold = 0,
    className,
}: LazySectionProps) {
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
            {
                rootMargin,
                threshold,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [rootMargin, threshold]);

    return (
        <div ref={containerRef} className={className}>
            {isVisible ? children : fallback}
        </div>
    );
}
