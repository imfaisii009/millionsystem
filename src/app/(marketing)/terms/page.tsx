import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | MillionSystems",
    description: "Read the terms and conditions for using MillionSystems's services and website.",
};

// ISR: Revalidate legal pages every 24 hours
export const revalidate = 86400;

export default function TermsOfServicePage() {
    const lastUpdated = "January 12, 2026";

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent -z-10 blur-3xl opacity-50" />
            <div className="absolute top-40 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-40 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: {lastUpdated}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-primary mx-auto rounded-full" />
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl space-y-12">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and MillionSystems ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">2. Intellectual Property Rights</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">3. User Representations</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">4. Prohibited Activities</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                                <li>Systematically retrieve data or other content from the Site.</li>
                                <li>Trick, defraud, or mislead us and other users.</li>
                                <li>Circumvent, disable, or otherwise interfere with security-related features.</li>
                                <li>Engage in unauthorized framing of or linking to the Site.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms shall be governed by and defined following the laws of United Kingdom. MillionSystems and yourself irrevocably consent that the courts of United Kingdom shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            </p>
                            <div className="bg-white/[0.05] p-6 rounded-2xl border border-white/5">
                                <p className="text-white font-semibold italic">MillionSystems HQ</p>
                                <p className="text-muted-foreground">Turner Business Centre, Greengate</p>
                                <p className="text-muted-foreground">Middleton, Manchester M24 1RU</p>
                                <p className="text-blue-400 mt-2">legal@millionsystems.com</p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
