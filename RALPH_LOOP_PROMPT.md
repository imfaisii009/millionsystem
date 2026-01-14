# RALPH Loop: MillionSystem Performance Optimization

## Mission
Optimize this Next.js 16 webapp to achieve **90+ Lighthouse Performance score** on mobile WITHOUT compromising the UI.

## Current State
- Performance: 11/100
- LCP: 7.9s (target: <2.5s)
- TBT: 29,270ms (target: <200ms)
- CLS: 0.499 (target: <0.1)
- Unused JS: 3,150 KB (react-icons barrel imports)

## Root Causes
1. `react-icons/si` and `react-icons/fa` barrel imports = 2,350 KB wasted
2. `"use client"` on page.tsx = no SSR benefits
3. No lazy loading for heavy components (Three.js, Maps, SDK)
4. Images without dimensions = layout shifts
5. No Next.js optimizations configured

---

## IMPLEMENTATION LOOP

### Step 1: Fix react-icons imports
**Action:**
1. Grep codebase for `react-icons/si` and `react-icons/fa`
2. For each file found:
   - Identify which icons are used
   - Replace with `lucide-react` equivalent OR individual icon imports
   - If no equivalent exists, create inline SVG component
3. Run `npm run build`
4. If build fails → debug, fix, repeat
5. If build succeeds → proceed to Step 2

**Verification:** `npm run build` succeeds with no errors

---

### Step 2: Convert page.tsx to Server Component
**Action:**
1. Read `src/app/page.tsx`
2. Create `src/components/sections/hero-section.tsx` with `"use client"`
   - Move hero JSX with animations to this component
   - Keep framer-motion imports here only
3. Remove `"use client"` from `src/app/page.tsx`
4. Import HeroSection in page.tsx
5. Run `npm run build`
6. If build fails → debug, fix, repeat
7. If build succeeds → proceed to Step 3

**Verification:** `npm run build` succeeds, page.tsx has no `"use client"`

---

### Step 3: Implement lazy loading for heavy components
**Action:**
1. In `src/app/page.tsx`, convert these to dynamic imports:
   ```tsx
   import dynamic from "next/dynamic";

   const SmartMap = dynamic(() => import("@/components/features/smart-map").then(m => ({ default: m.SmartMap })), {
     ssr: false,
     loading: () => <div className="h-[600px] bg-gray-900/50 animate-pulse rounded-xl" />
   });

   const SDKShowcase = dynamic(() => import("@/components/features/sdk-showcase").then(m => ({ default: m.SDKShowcase })), {
     loading: () => <div className="h-[500px] bg-gray-900/50 animate-pulse rounded-xl" />
   });

   const ProjectStack = dynamic(() => import("@/components/features/project-stack").then(m => ({ default: m.ProjectStack })), {
     loading: () => <div className="h-[600px] bg-gray-900/50 animate-pulse rounded-xl" />
   });

   const TestimonialDataStream = dynamic(() => import("@/components/sections/testimonial-data-stream").then(m => ({ default: m.TestimonialDataStream })), {
     loading: () => <div className="h-[400px] bg-gray-900/50 animate-pulse rounded-xl" />
   });

   const ContactSection = dynamic(() => import("@/components/sections/contact-section").then(m => ({ default: m.ContactSection })), {
     loading: () => <div className="h-[600px] bg-gray-900/50 animate-pulse rounded-xl" />
   });
   ```
2. Update ThreeRubiksCube loading skeleton to match cube dimensions
3. Run `npm run build`
4. If build fails → debug, fix, repeat
5. If build succeeds → proceed to Step 4

**Verification:** `npm run build` succeeds

---

### Step 4: Fix image dimensions (CLS)
**Action:**
1. Read `src/components/features/trusted-companies.tsx`
2. Add explicit `width` and `height` to all Image components
3. Read `src/components/features/project-stack.tsx`
4. Add explicit `width` and `height` to all Image components
5. Add `placeholder="blur"` with blurDataURL where applicable
6. Run `npm run build`
7. If build fails → debug, fix, repeat
8. If build succeeds → proceed to Step 5

**Verification:** `npm run build` succeeds

---

### Step 5: Update Next.js config
**Action:**
1. Update `next.config.ts`:
   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     trailingSlash: false,
     poweredByHeader: false,
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920],
       imageSizes: [16, 32, 48, 64, 96, 128, 256],
     },
     experimental: {
       optimizePackageImports: [
         'lucide-react',
         'framer-motion',
         '@radix-ui/react-dialog',
         '@radix-ui/react-dropdown-menu',
         '@radix-ui/react-tabs',
         '@radix-ui/react-avatar',
         'date-fns',
       ],
     },
   };

   export default nextConfig;
   ```
2. Run `npm run build`
3. If build fails → debug, fix, repeat
4. If build succeeds → proceed to Step 6

**Verification:** `npm run build` succeeds

---

### Step 6: Build Verification
**Action:**
1. Run `npm run build`
2. Check build output for bundle sizes
3. Verify no errors or warnings related to our changes
4. If any issues → debug, fix, repeat from relevant step
5. If success → proceed to Step 7

**Verification:** Build completes successfully

---

### Step 7: Lighthouse Audit via Playwright MCP
**Action:**
1. Start dev server if not running: `npm run dev`
2. Use Playwright MCP to:
   - Navigate to `http://localhost:3000`
   - Open Chrome DevTools
   - Run Lighthouse audit (Mobile, Performance category)
   - Capture scores: Performance, LCP, TBT, CLS
3. Evaluate results:
   - If Performance >= 90 AND LCP < 2.5s AND TBT < 300ms AND CLS < 0.1 → proceed to Step 8
   - If Performance < 90 → analyze failing metrics, identify cause, fix, repeat from Step 7
   - If specific metric fails:
     - LCP too high → check image loading, lazy load more aggressively
     - TBT too high → find remaining heavy JS, code split further
     - CLS too high → find elements without dimensions, add placeholders

**Verification:** Lighthouse Performance >= 90

---

### Step 8: Visual Regression Check
**Action:**
1. Use Playwright MCP to:
   - Navigate to `http://localhost:3000`
   - Take full-page screenshot
   - Scroll through all sections
   - Verify all components render correctly:
     - Hero section with 3D cube
     - Tech marquee animating
     - SDK showcase tabs working
     - Project carousel functional
     - Map loads on scroll
     - Contact form visible
2. If any visual issues → debug, fix, repeat from relevant step
3. If all visuals correct → proceed to Final Output

**Verification:** All UI elements render correctly, no visual regressions

---

## SUCCESS CRITERIA

| Metric | Target | Required |
|--------|--------|----------|
| Performance Score | >= 90 | YES |
| LCP | < 2.5s | YES |
| TBT | < 300ms | YES |
| CLS | < 0.1 | YES |
| Build | Success | YES |
| UI | No regressions | YES |

---

## FINAL OUTPUT

When ALL success criteria are met, output:

```
## Optimization Complete

### Changes Made:
- [List all files modified]
- [Summary of each change]

### Before/After Metrics:
| Metric | Before | After |
|--------|--------|-------|
| Performance | 11 | [NEW] |
| LCP | 7.9s | [NEW] |
| TBT | 29,270ms | [NEW] |
| CLS | 0.499 | [NEW] |

### Bundle Size Reduction:
- Before: ~4MB
- After: [NEW]
- Saved: [DIFF]

<promise>COMPLETE</promise>
```

---

## CONSTRAINTS

1. **DO NOT** change visual design - colors, layouts, animations identical
2. **DO NOT** remove features - all functionality must work
3. **DO NOT** skip verification steps
4. **DO NOT** output `<promise>COMPLETE</promise>` until ALL criteria met
5. **ALWAYS** run build after each step
6. **ALWAYS** fix errors before proceeding

---

## ERROR RECOVERY

If stuck in a loop:
1. Identify the failing step
2. Read error messages carefully
3. Check if import paths are correct
4. Verify component exports match imports
5. If still stuck after 3 attempts on same error → ask user for guidance

