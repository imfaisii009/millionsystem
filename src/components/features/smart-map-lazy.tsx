"use client";

import dynamic from "next/dynamic";

const SmartMap = dynamic(() => import("@/components/features/smart-map").then(m => ({ default: m.SmartMap })), {
    ssr: false,
    loading: () => <div className="h-[600px] bg-gray-900/50 animate-pulse rounded-xl" />
});

export function SmartMapLazy() {
    return <SmartMap />;
}
