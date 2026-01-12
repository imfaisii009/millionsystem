"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Globe, Loader2, MapPin } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Polyline, OverlayView } from "@react-google-maps/api";

// Turner Business Centre, Greengate, Middleton, Manchester M24 1RU
const OFFICE_COORDS = { lat: 53.534306, lng: -2.173976 };

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

// Slightly lighter dark map for better visibility
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#0f1025" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f1025" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#2d3047" }],
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4b5563" }],
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#1f2235" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0f1025" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#2d3047" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0f1025" }],
    },
    {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#06070a" }]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#2d3047" }],
    },
];

// SVG Icons as Data URIs for stable native Markers
const hqIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <defs>
            <filter id="buildingGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="bldgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f472b6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#db2777;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Animated Base Ripple -->
        <circle cx="40" cy="65" r="15" fill="#db2777" opacity="0.3">
             <animate attributeName="r" values="15;30;15" dur="3s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        <!-- Building Shape -->
        <g filter="url(#buildingGlow)" transform="translate(20, 15)">
            <!-- Main Tower -->
            <path d="M10 50h20V10L20 4l-10 6z" fill="url(#bldgGrad)" stroke="white" stroke-width="2"/>
            <!-- Side Wing -->
            <path d="M30 50h10V25l-10 5z" fill="#be185d" stroke="white" stroke-width="2"/>
            
            <!-- Windows -->
            <rect x="15" y="15" width="3" height="4" fill="white" opacity="0.7"/>
            <rect x="22" y="15" width="3" height="4" fill="white" opacity="0.7"/>
            <rect x="15" y="25" width="3" height="4" fill="white" opacity="0.7"/>
            <rect x="22" y="25" width="3" height="4" fill="white" opacity="0.7"/>
            <rect x="15" y="35" width="3" height="4" fill="white" opacity="0.7"/>
            <rect x="22" y="35" width="3" height="4" fill="white" opacity="0.7"/>
            
            <!-- Logo H -->
            <text x="20" y="8" font-family="Arial" font-weight="bold" font-size="8" fill="white" text-anchor="middle">H</text>
        </g>
    </svg>`),
    scaledSize: { width: 80, height: 80 },
    anchor: { x: 40, y: 70 }
};

const userIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
        <defs>
            <filter id="laptopGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
            </linearGradient>
        </defs>

        <!-- Animated Base Ripple -->
        <circle cx="35" cy="55" r="12" fill="#3b82f6" opacity="0.3">
             <animate attributeName="r" values="12;24;12" dur="3s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        <!-- Laptop Icon -->
        <g transform="translate(15, 20)">
            <!-- Screen Base -->
            <rect x="5" y="2" width="30" height="20" rx="2" fill="#1e293b" stroke="white" stroke-width="1.5" />
            <!-- Screen Display (Glowing) -->
            <rect x="7" y="4" width="26" height="16" fill="url(#laptopGrad)" filter="url(#laptopGlow)">
                 <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </rect>
            <!-- Code Lines -->
            <path d="M9 8h10M9 12h14M9 16h8" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
            
            <!-- Keyboard Base -->
            <path d="M0 22h40l-2 4H2z" fill="#cbd5e1"/>
            <path d="M2 22h36v1H2z" fill="#475569"/>
        </g>
    </svg>`),
    scaledSize: { width: 70, height: 70 },
    anchor: { x: 35, y: 60 }
};

export function SmartMap() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [pathProgress, setPathProgress] = useState(0);
    const animationRef = useRef<number | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);
        setPathProgress(0);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(userLoc);

                const dist = calculateDistance(
                    OFFICE_COORDS.lat,
                    OFFICE_COORDS.lng,
                    userLoc.lat,
                    userLoc.lng
                );
                setDistance(Math.round(dist));
                setLoading(false);

                // Animate path drawing
                let progress = 0;
                const animate = () => {
                    progress += 0.02;
                    if (progress <= 1) {
                        setPathProgress(progress);
                        animationRef.current = requestAnimationFrame(animate);
                    } else {
                        setPathProgress(1);
                    }
                };
                animationRef.current = requestAnimationFrame(animate);

                // Fit bounds to show both markers
                if (map) {
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(OFFICE_COORDS);
                    bounds.extend(userLoc);
                    map.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
                }
            },
            (err) => {
                console.error(err);
                setError("Location access denied. Please enable location permissions.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Generate curved path points between two locations
    const generateCurvedPath = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral, progress: number) => {
        const points: google.maps.LatLngLiteral[] = [];
        const numPoints = Math.floor(100 * progress);

        // Calculate midpoint with offset for curve
        const midLat = (start.lat + end.lat) / 2;
        const midLng = (start.lng + end.lng) / 2;

        // Calculate perpendicular offset for arc (20% of distance)
        const latDiff = end.lat - start.lat;
        const lngDiff = end.lng - start.lng;
        // Reduced Arc Height for a tighter curve
        const arcHeight = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 0.15;

        // Perpendicular vector
        const perpLat = -lngDiff;
        const perpLng = latDiff;
        const perpLength = Math.sqrt(perpLat * perpLat + perpLng * perpLng);

        const controlPoint = {
            lat: midLat + (perpLat / perpLength) * arcHeight,
            lng: midLng + (perpLng / perpLength) * arcHeight
        };

        for (let i = 0; i <= numPoints; i++) {
            const t = i / 100;
            // Quadratic Bezier curve
            const lat = (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * controlPoint.lat + t * t * end.lat;
            const lng = (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * controlPoint.lng + t * t * end.lng;
            points.push({ lat, lng });
        }

        return points;
    };

    // Calculate midpoint for distance badge
    const getMidpoint = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral) => {
        return {
            lat: (start.lat + end.lat) / 2,
            lng: (start.lng + end.lng) / 2
        };
    };

    // Fallback SVG visualization (same as before but enhanced)
    const FallbackVisualization = () => (
        <div className="relative w-full h-full bg-[#0f1025] flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                {/* Abstract world shapes - simplified */}
                <g stroke="none" fill="rgba(255, 255, 255, 0.05)">
                    <path d="M50,150 Q150,50 250,150 T450,150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5,5" />
                </g>
                {/* HQ Marker */}
                <g transform="translate(200, 150)">
                    <circle r="40" fill="#ec4899" opacity="0.1">
                        <animate attributeName="r" values="30;50;30" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="8" fill="#ec4899" stroke="white" strokeWidth="2" />
                    <text y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">HQ</text>
                </g>
            </svg>
            {!isLoaded && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <span className="text-xs text-white/50">Initializing Satellite...</span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full bg-card/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden relative group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 z-10 relative">
                <div className="space-y-8 md:w-1/3">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-primary">
                                <Globe className="w-6 h-6" />
                                Beyond Borders
                            </span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-base">
                            Distance doesn't define us. We collaborate in real-time, bridging thousands of miles instantly
                            to make it feel like we&apos;re in the same room. Direct digital commuting means we&apos;re right there with you.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!userLocation && !loading && (
                            <motion.button
                                key="locate-btn"
                                onClick={handleGetLocation}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium transition-all hover:bg-white/10 hover:border-primary/50 overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Navigation className="w-5 h-5 text-primary relative z-10 group-hover:rotate-12 transition-transform" />
                                <span className="relative z-10 font-semibold tracking-wide">
                                    Calculate Distance
                                </span>
                            </motion.button>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                className="flex items-center gap-3 text-primary p-4 bg-primary/5 rounded-xl border border-primary/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="uppercase tracking-widest text-xs font-semibold">
                                    Triangulating Location...
                                </span>
                            </motion.div>
                        )}

                        {userLocation && distance !== null && (
                            <motion.div
                                key="result"
                                className="space-y-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="bg-[#0f1025] border border-white/10 rounded-2xl p-6 relative overflow-hidden group/card hover:border-primary/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-purple-500/20">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1">Direct Connection</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-white">
                                                    {distance.toLocaleString()}
                                                </p>
                                                <span className="text-sm text-gray-400 font-medium">km</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Connected via low-latency hub</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUserLocation(null);
                                        setDistance(null);
                                        setPathProgress(0);
                                        if (map) {
                                            map.setCenter(OFFICE_COORDS);
                                            map.setZoom(4);
                                        }
                                    }}
                                    className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 group/reset pr-2"
                                >
                                    <span className="group-hover/reset:-translate-x-1 transition-transform">←</span> Reset Connection
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.p
                            className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                {/* Map Container */}
                <div className="relative w-full md:w-2/3 aspect-[16/9] bg-[#0f1025] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    {/* Overlay Gradients for fade effect */}
                    <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={OFFICE_COORDS}
                            zoom={5}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                styles: darkMapStyle,
                                disableDefaultUI: true,
                                zoomControl: true,
                                zoomControlOptions: {
                                    position: google.maps.ControlPosition.RIGHT_BOTTOM,
                                },
                                backgroundColor: "#0f1025",
                                gestureHandling: "cooperative",
                                disableDoubleClickZoom: true,
                                minZoom: 3,
                                maxZoom: 12,
                            }}
                        >
                            {/* HQ Marker - Native Marker to prevent drift */}
                            {/* @ts-ignore - types conflict with strict mode but works */}
                            <Marker
                                position={OFFICE_COORDS}
                                icon={hqIcon as any}
                                zIndex={2}
                            />

                            {/* User Marker */}
                            {userLocation && pathProgress >= 1 && (
                                // @ts-ignore
                                <Marker
                                    position={userLocation}
                                    icon={userIcon as any}
                                    zIndex={2}
                                />
                            )}

                            {/* Animated Curved Line */}
                            {userLocation && pathProgress > 0 && (
                                <>
                                    <Polyline
                                        path={generateCurvedPath(OFFICE_COORDS, userLocation, pathProgress)}
                                        options={{
                                            strokeColor: "#ec4899",
                                            strokeOpacity: 1,
                                            strokeWeight: 2,
                                            geodesic: true,
                                            icons: [{
                                                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 3, fillColor: "white", fillOpacity: 1, strokeWeight: 0 },
                                                offset: "100%"
                                            }]
                                        }}
                                    />
                                    {/* Ghost line for glow */}
                                    <Polyline
                                        path={generateCurvedPath(OFFICE_COORDS, userLocation, pathProgress)}
                                        options={{
                                            strokeColor: "#ec4899",
                                            strokeOpacity: 0.3,
                                            strokeWeight: 6,
                                            geodesic: true
                                        }}
                                    />
                                </>
                            )}


                        </GoogleMap>
                    ) : (
                        <FallbackVisualization />
                    )}

                    {loadError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#05050A]">
                            <p className="text-red-500 text-sm">Map Error: {loadError.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
