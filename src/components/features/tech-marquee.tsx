"use client";

import { motion } from "framer-motion";

const techs = [
    // Frontend Frameworks & Libraries
    "React", "Next.js", "Vue.js", "Nuxt", "Angular", "Svelte", "Astro", "Remix",
    // Languages & Type Systems
    "TypeScript", "JavaScript", "Python", "Go", "Rust", "PHP", "Ruby",
    // Styling & Animation
    "Tailwind CSS", "Framer Motion", "GSAP", "Sass", "Styled Components",
    // Backend & Runtime
    "Node.js", "Express", "NestJS", "Django", "FastAPI", "Laravel", "Rails",
    // Databases
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma", "Drizzle",
    // Cloud & BaaS
    "Supabase", "Firebase", "AWS", "Google Cloud", "Azure", "Vercel", "Cloudflare",
    // DevOps & Infrastructure
    "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Nginx",
    // APIs & Communication
    "GraphQL", "REST API", "tRPC", "WebSockets", "gRPC",
    // Payments & E-commerce
    "Stripe", "PayPal", "Shopify", "WooCommerce",
    // Auth & Security
    "Auth0", "Clerk", "NextAuth", "OAuth", "JWT",
    // AI & ML
    "OpenAI", "LangChain", "TensorFlow", "PyTorch", "Hugging Face",
    // Design & 3D
    "Figma", "Three.js", "WebGL", "Blender",
    // Mobile
    "React Native", "Flutter", "Expo", "Swift", "Kotlin",
    // Testing & Quality
    "Jest", "Cypress", "Playwright", "Vitest",
    // CMS & Content
    "Sanity", "Strapi", "Contentful", "WordPress",
    // Analytics & Monitoring
    "Sentry", "Datadog", "Mixpanel", "PostHog"
];

export function TechMarquee() {
    return (
        <div className="relative flex overflow-hidden py-10 bg-background/50 border-y border-white/5">
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-background via-transparent to-background" />

            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            >
                {[...techs, ...techs].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground group-hover:from-white group-hover:to-white transition-all">
                            {tech}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
