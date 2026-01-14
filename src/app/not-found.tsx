'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileWarning, Home, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Glitch variants for the 404 text
  const glitchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  // Floating particles background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      <Header />

      <main className="flex-1 flex items-center justify-center relative w-full h-full min-h-[calc(100vh-80px)]">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}

        <div className="relative z-10 container flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={glitchVariants}
            className="relative"
          >
            {/* Glitchy 404 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none relative">
              4
              <span className="inline-block animate-pulse text-primary decoration-double">
                0
              </span>
              4
              <motion.span
                className="absolute top-0 left-0 w-full h-full text-primary/20 -z-10 blur-sm"
                animate={{
                  x: [-2, 2, -2],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                404
              </motion.span>
            </h1>

            {/* Orbiting Element */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[30%] border border-primary/30 rounded-[100%] rotate-12"
              animate={{ rotate: [12, 372] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
            </motion.div>
          </motion.div>

          {/* Alert Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 mb-6 relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center gap-3 px-6 py-4 bg-background border border-border/50 rounded-lg shadow-xl backdrop-blur-sm">
              <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                <FileWarning className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold">System Malfunction</h2>
                <p className="text-muted-foreground">The requested data stream could not be located.</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                Return to Base
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 group hover:border-primary/50 hover:bg-primary/5"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Retry Connection
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
