import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy | MillionSystems",
    description: "Understand how MillionSystems uses cookies and tracking technologies on our website.",
};

// ISR: Revalidate legal pages every 24 hours
export const revalidate = 86400;

export default function CookiePolicyPage() {
    const lastUpdated = "January 12, 2026";

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent -z-10 blur-3xl opacity-50" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Cookie Policy
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: {lastUpdated}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl space-y-12">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">1. What Are Cookies?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">2. Why Do We Use Cookies?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">3. Types of Cookies We Use</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-2">
                                    <h3 className="font-semibold text-white">Essential Cookies</h3>
                                    <p className="text-sm text-muted-foreground">Required for site functionality and security. Cannot be disabled.</p>
                                </div>
                                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-2">
                                    <h3 className="font-semibold text-white">Performance Cookies</h3>
                                    <p className="text-sm text-muted-foreground">Help us understand how visitors interact with the site by collecting anonymous data.</p>
                                </div>
                                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-2">
                                    <h3 className="font-semibold text-white">Functionality Cookies</h3>
                                    <p className="text-sm text-muted-foreground">Used to remember choices you make (like your language) to provide a better experience.</p>
                                </div>
                                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-2">
                                    <h3 className="font-semibold text-white">Targeting Cookies</h3>
                                    <p className="text-sm text-muted-foreground">Used to deliver advertisements more relevant to you and your interests.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">4. Control Your Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Updates to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about our use of cookies or other technologies, please email us at:
                            </p>
                            <div className="bg-white/[0.05] p-6 rounded-2xl border border-white/5">
                                <p className="text-white font-semibold italic">MillionSystems HQ</p>
                                <p className="text-muted-foreground">Turner Business Centre, Greengate</p>
                                <p className="text-muted-foreground">Middleton, Manchester M24 1RU</p>
                                <p className="text-purple-400 mt-2">privacy@millionsystems.com</p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
