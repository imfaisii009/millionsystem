import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | MillionSystems",
    description: "Learn how MillionSystems protects and manages your personal data.",
};

// ISR: Revalidate legal pages every 24 hours
export const revalidate = 86400;

export default function PrivacyPolicyPage() {
    const lastUpdated = "January 12, 2026";

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-3xl opacity-50" />
            <div className="absolute top-20 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: {lastUpdated}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full" />
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl space-y-12">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At MillionSystems, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may collect information about you in a variety of ways. Includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                                <li>Personal Data: Name, email address, and contact details provided voluntarily.</li>
                                <li>Derivative Data: Information our servers automatically collect (IP address, browser type, etc.).</li>
                                <li>Financial Data: Payment information related to your purchases or subscriptions.</li>
                                <li>Social Media Data: Information from social networks if you connect your account.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">3. Use of Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Having accurate information about you allows us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                                <li>Create and manage your account.</li>
                                <li>Process your transactions and send related information.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Fulfill and manage purchases, orders, payments, and other transactions.</li>
                                <li>Increase the efficiency and operation of the Site.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">4. Disclosure of Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                                <li>By Law or to Protect Rights: If we believe the release of information about you is necessary.</li>
                                <li>Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf.</li>
                                <li>Marketing Communications: With your consent, we may share your information with third parties for marketing purposes.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Security of Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <div className="bg-white/[0.05] p-6 rounded-2xl border border-white/5">
                                <p className="text-white font-semibold italic">MillionSystems HQ</p>
                                <p className="text-muted-foreground">Turner Business Centre, Greengate</p>
                                <p className="text-muted-foreground">Middleton, Manchester M24 1RU</p>
                                <p className="text-primary mt-2">legal@millionsystems.com</p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
