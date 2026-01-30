import dynamic from "next/dynamic";
import { LazySection } from "@/components/ui/lazy-section";

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

// Hero section - loaded immediately but cube is deferred
const HeroSection = dynamic(() => import("@/components/sections/hero-section").then(m => ({ default: m.HeroSection })), {
    loading: () => <div className="min-h-screen bg-[#030014]" />
});

// Below-the-fold components - truly lazy loaded when in viewport
const AboutHaysSection = dynamic(() => import("@/components/sections/about-hays-section").then(m => ({ default: m.AboutHaysSection })));
const CodingServicesSection = dynamic(() => import("@/components/sections/coding-services-section").then(m => ({ default: m.CodingServicesSection })));
const DigitalGrowthSection = dynamic(() => import("@/components/sections/digital-growth-section").then(m => ({ default: m.DigitalGrowthSection })));
const TechMarquee = dynamic(() => import("@/components/features/tech-marquee").then(m => ({ default: m.TechMarquee })));
const SDKShowcase = dynamic(() => import("@/components/features/sdk-showcase").then(m => ({ default: m.SDKShowcase })));
const TrustedCompanies = dynamic(() => import("@/components/features/trusted-companies").then(m => ({ default: m.TrustedCompanies })));
const ProjectStack = dynamic(() => import("@/components/features/project-stack").then(m => ({ default: m.ProjectStack })));
const SmartMapLazy = dynamic(() => import("@/components/features/smart-map-lazy").then(m => ({ default: m.SmartMapLazy })));
const TestimonialDataStream = dynamic(() => import("@/components/sections/testimonial-data-stream").then(m => ({ default: m.TestimonialDataStream })));
const ContactSection = dynamic(() => import("@/components/sections/contact-section").then(m => ({ default: m.ContactSection })));

// Skeleton components for loading states
const Skeleton = ({ height, className = "" }: { height: string; className?: string }) => (
    <div className={`${height} bg-gray-900/50 animate-pulse rounded-xl ${className}`} />
);

export default function Home() {
    return (
        <div className="flex flex-col gap-20 pb-20 overflow-hidden bg-[#030014]">
            {/* Hero Section - Critical above-the-fold content */}
            <HeroSection />

            {/* Below-fold sections - only loaded when scrolled into view */}
            <LazySection
                fallback={<Skeleton height="h-[1600px]" />}
                rootMargin="400px"
            >
                <div id="services">
                    <AboutHaysSection />
                    <CodingServicesSection />
                    <DigitalGrowthSection />
                </div>
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[100px]" />}
                rootMargin="200px"
            >
                <section className="w-full">
                    <TechMarquee />
                </section>
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[500px]" />}
                rootMargin="200px"
            >
                <SDKShowcase />
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[200px]" />}
                rootMargin="200px"
            >
                <TrustedCompanies />
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[600px]" />}
                rootMargin="200px"
            >
                <section id="portfolio" className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center text-white tracking-tight">
                        Projects We <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Develop</span>
                    </h2>
                    <p className="text-center text-blue-100/40 text-lg mb-12 max-w-2xl mx-auto">
                        We specialize in engineering high-performance platforms across these industries.
                    </p>
                    <ProjectStack />
                </section>
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[600px]" />}
                rootMargin="200px"
            >
                <section className="container mx-auto px-4 md:px-6">
                    <SmartMapLazy />
                </section>
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[400px]" />}
                rootMargin="200px"
            >
                <TestimonialDataStream />
            </LazySection>

            <LazySection
                fallback={<Skeleton height="h-[600px]" />}
                rootMargin="200px"
            >
                <ContactSection />
            </LazySection>
        </div>
    );
}
