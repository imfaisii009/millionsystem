# MillionSystem Performance Optimization Plan

## Current State (Lighthouse Mobile - January 2026)

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| **Performance** | 11 | 90+ | -79 |
| **Accessibility** | 84 | 90+ | -6 |
| **Best Practices** | 96 | 96 | ✓ |
| **SEO** | 100 | 100 | ✓ |

### Core Web Vitals

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| FCP | 2.6s | <1.8s | HIGH |
| LCP | 7.9s | <2.5s | CRITICAL |
| TBT | 29,270ms | <200ms | CRITICAL |
| CLS | 0.499 | <0.1 | CRITICAL |
| Speed Index | 33.8s | <3.4s | CRITICAL |
| TTI | 54.0s | <3.8s | CRITICAL |

---

## Root Causes Analysis

### 1. Unused JavaScript (3,150 KB wasted)
- `react-icons/si` - 1,917 KB (imports ALL icons)
- `react-icons/fa` - 433 KB (imports ALL icons)
- `three.js` - 184 KB combined
- `zod` - 68 KB
- `@react-google-maps` - 54 KB

### 2. Client-Side Rendering Overload
- `src/app/page.tsx` has `"use client"` at top
- Forces 100% JavaScript hydration
- No SSR benefits

### 3. Layout Shifts
- Images without explicit width/height
- Dynamic content without placeholders
- Three.js cube loads with empty div

### 4. No Code Splitting
- All sections load immediately
- No lazy loading for below-fold content

---

## Implementation Phases

### Phase 1: Critical Fixes (TBT & Bundle Size)

#### 1.1 Fix react-icons imports
**Files:** All files using react-icons
**Change:** Import icons individually, not from barrel exports

```tsx
// ❌ BEFORE (loads entire icon pack)
import { SiReact, SiNextdotjs } from "react-icons/si";

// ✅ AFTER (loads only what's needed)
import { SiReact } from "@icons-pack/react-simple-icons";
// OR use lucide-react which is already installed
import { Code2, Globe } from "lucide-react";
```

**Expected savings:** ~2,350 KB

#### 1.2 Convert page.tsx to Server Component
**File:** `src/app/page.tsx`
**Change:** Remove `"use client"`, extract client parts to separate components

```tsx
// ✅ page.tsx becomes Server Component
// Move interactive parts to client components
import { HeroSection } from "@/components/sections/hero-section";
// HeroSection has "use client" for animations
```

#### 1.3 Lazy load below-fold sections
**File:** `src/app/page.tsx`
**Change:** Dynamic imports with loading states

```tsx
const SmartMap = dynamic(() => import("@/components/features/smart-map"), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-900/50 animate-pulse" />
});

const SDKShowcase = dynamic(() => import("@/components/features/sdk-showcase"), {
  loading: () => <div className="h-[400px] bg-gray-900/50 animate-pulse" />
});
```

---

### Phase 2: Layout Shift Fixes (CLS)

#### 2.1 Add explicit dimensions to images
**Files:** Components using `next/image`
**Change:** Add width, height, and placeholder

```tsx
<Image
  src="/logos/company.png"
  alt="Company"
  width={120}
  height={40}
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
/>
```

#### 2.2 Reserve space for Three.js cube
**File:** `src/app/page.tsx`
**Change:** Proper skeleton loader

```tsx
const ThreeRubiksCube = dynamic(
  () => import("@/components/features/three-rubiks-cube"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="w-64 h-64 bg-purple-500/10 rounded-xl animate-pulse" />
      </div>
    )
  }
);
```

---

### Phase 3: Next.js Config Optimization

#### 3.1 Update next.config.ts
**File:** `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
};

export default nextConfig;
```

---

### Phase 4: Component-Level Optimizations

#### 4.1 Optimize Framer Motion usage
- Use CSS animations for simple transitions
- Lazy load framer-motion only where needed
- Add `will-change` hints for animated elements

#### 4.2 Implement intersection observer for animations
- Only animate elements when visible
- Stop animations when out of viewport
- Respect `prefers-reduced-motion`

#### 4.3 Optimize Google Maps
- Load only when user scrolls near section
- Use static map image as placeholder

---

## Success Criteria

| Metric | Current | Phase 1 | Phase 2 | Phase 3 | Final |
|--------|---------|---------|---------|---------|-------|
| Performance | 11 | 45+ | 65+ | 80+ | 90+ |
| LCP | 7.9s | 4.0s | 3.0s | 2.5s | <2.5s |
| TBT | 29,270ms | 2,000ms | 500ms | 200ms | <200ms |
| CLS | 0.499 | 0.25 | 0.1 | 0.05 | <0.1 |

---

## Files to Modify

### Critical (Phase 1)
1. `src/app/page.tsx` - Remove "use client", add lazy loading
2. `src/components/features/tech-marquee.tsx` - Fix react-icons imports
3. `src/components/features/sdk-showcase.tsx` - Fix react-icons imports
4. `next.config.ts` - Add optimizations

### High Priority (Phase 2)
5. `src/components/features/project-stack.tsx` - Add image dimensions
6. `src/components/features/trusted-companies.tsx` - Add image dimensions
7. `src/components/features/three-rubiks-cube.tsx` - Add loading skeleton

### Medium Priority (Phase 3-4)
8. `src/components/features/smart-map.tsx` - Lazy load Google Maps
9. `src/components/sections/*.tsx` - Extract client components
10. All animation components - Add reduced motion support

---

## Verification Steps

After each phase:
1. Run `npm run build` to check bundle size
2. Run Lighthouse audit (Mobile)
3. Check Core Web Vitals in Chrome DevTools
4. Test on throttled 3G connection
5. Verify UI remains unchanged

