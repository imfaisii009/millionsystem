"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Globe } from "lucide-react";

// Mock office location (e.g., San Francisco)
const OFFICE_COORDS = { lat: 37.7749, lng: -122.4194 };

export function SmartMap() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate getting location or fetch from IP API
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data.latitude && data.longitude) {
                    const userLoc = { lat: data.latitude, lng: data.longitude };
                    setUserLocation(userLoc);

                    // Calculate Haversine distance
                    const dist = calculateDistance(
                        OFFICE_COORDS.lat,
                        OFFICE_COORDS.lng,
                        userLoc.lat,
                        userLoc.lng
                    );
                    setDistance(Math.round(dist));
                } else {
                    setError("Could not locate");
                }
            })
            .catch(() => setError("Location blocked"))
            .finally(() => setLoading(false));
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    return (
        <div className="w-full bg-card/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden relative group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Globe className="text-primary w-6 h-6" />
                        Global Reach, Local Feel
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                        We work with clients worldwide. No matter where you are, our digital solutions bridge the gap.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                <Navigation className="w-4 h-4 animate-spin" /> Calculating distance...
                            </div>
                        ) : error ? (
                            <p className="text-sm text-red-400">Could not determine location automatically.</p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Distance from HQ</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-primary">{distance?.toLocaleString()}</span>
                                    <span className="text-lg text-white/60">km</span>
                                </div>
                                <p className="text-xs text-white/40">From your estimated location</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visual Map Representation (Abstract) */}
                <div className="relative w-full md:w-1/2 aspect-video bg-[#111] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* Connection Line Animation */}
                    {!loading && userLocation && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <motion.path
                                d={`M 200 150 Q 300 50 400 150`} // Simplified bezier for demo
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    )}

                    {/* Office Pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                            <MapPin className="text-primary w-8 h-8 relative z-10" />
                        </div>
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs">HQ</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
