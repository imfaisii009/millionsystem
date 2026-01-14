'use client'

import { motion } from 'framer-motion'
import { Briefcase, SearchX, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CareersEmptyState() {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Background Glow Effects */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl"
            >
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="flex flex-col items-center justify-center text-center p-12 md:p-16 space-y-8">
                    {/* Animated Icon Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-inner">
                            <Briefcase className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />

                            {/* Floating Status Badge */}
                            <motion.div
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-2 -right-2 bg-background/80 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-lg"
                            >
                                <SearchX className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="space-y-4 max-w-lg">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            No Openings Available
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We're currently fully staffed with amazing talent. However, the future is always expanding.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                    >
                        <Button
                            variant="outline"
                            className="group border-white/10 hover:border-primary/50 hover:bg-primary/5 data-[state=open]:bg-transparent"
                            asChild
                        >
                            <Link href="/contact">
                                Send Spontaneous Application
                                <Sparkles className="ml-2 w-4 h-4 transition-transform group-hover:scale-110 text-yellow-500" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                        >
                            <Link href="/">
                                Explore Our Work
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            </motion.div>
        </div>
    )
}
