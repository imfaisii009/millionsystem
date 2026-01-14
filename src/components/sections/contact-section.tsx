"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Phone, MapPin, Clock, Send, Loader2, ChevronDown, MessageSquare, Calendar } from "lucide-react"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
    CalendarPicker,
    TimeSlotPicker,
    BookingForm,
    BookingConfirmation,
} from "@/components/booking"
import type { BookingFormData } from "@/schemas/booking.schema"
import type { CreateBookingResponse } from "@/types/booking"

// --- Zod Schema ---
const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    projectType: z.string().min(1, "Please select a project type"),
    budget: z.string().min(1, "Please select a budget range"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

const PROJECT_TYPES = [
    "AI & Automation",
    "Website Development",
    "Software Development",
    "Mobile App Development",
    "Game Development",
    "AR/VR Development",
    "Backend & Cloud Services",
    "E-commerce Solutions",
    "Digital Marketing & SEO",
]

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Booking state
    const [bookingStep, setBookingStep] = useState<'calendar' | 'form' | 'confirmation'>('calendar')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    const [confirmedBooking, setConfirmedBooking] = useState<CreateBookingResponse['booking'] | null>(null)
    const [bookingEmail, setBookingEmail] = useState<string>('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            projectType: "",
            budget: "",
            message: "",
        },
    })

    // Fetch available slots when date is selected
    const fetchAvailableSlots = useCallback(async (date: Date) => {
        setIsLoadingSlots(true)
        setAvailableSlots([])
        setSelectedSlot(null)

        try {
            const dateStr = format(date, 'yyyy-MM-dd')
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

            const response = await fetch(`/api/cal/availability?date=${dateStr}&timeZone=${encodeURIComponent(timeZone)}`)

            if (!response.ok) {
                throw new Error('Failed to fetch availability')
            }

            const data = await response.json()
            setAvailableSlots(data.slots || [])
        } catch (error) {
            console.error('Error fetching slots:', error)
            toast.error('Failed to load available times', {
                description: 'Please try again or select a different date.',
            })
        } finally {
            setIsLoadingSlots(false)
        }
    }, [])

    // Handle date selection
    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date)
        fetchAvailableSlots(date)
    }, [fetchAvailableSlots])

    // Handle slot selection
    const handleSlotSelect = useCallback((slot: string) => {
        setSelectedSlot(slot)
        setBookingStep('form')
    }, [])

    // Handle booking form submission
    const handleBookingSubmit = useCallback(async (data: BookingFormData) => {
        if (!selectedSlot) return

        setIsBooking(true)
        setBookingEmail(data.email)

        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

            const response = await fetch('/api/cal/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startTime: selectedSlot,
                    name: data.name,
                    email: data.email,
                    company: data.company,
                    projectType: data.projectType,
                    notes: data.notes,
                    timeZone,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create booking')
            }

            const result: CreateBookingResponse = await response.json()
            setConfirmedBooking(result.booking)
            setBookingStep('confirmation')

            toast.success('Meeting scheduled!', {
                description: 'Check your email for the calendar invite.',
            })
        } catch (error) {
            console.error('Booking error:', error)
            toast.error('Failed to schedule meeting', {
                description: error instanceof Error ? error.message : 'Please try again.',
            })
        } finally {
            setIsBooking(false)
        }
    }, [selectedSlot])

    // Reset booking state
    const resetBooking = useCallback(() => {
        setBookingStep('calendar')
        setSelectedDate(null)
        setSelectedSlot(null)
        setAvailableSlots([])
        setConfirmedBooking(null)
        setBookingEmail('')
    }, [])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message")
            }

            // Trigger celebration confetti
            const duration = 2000
            const end = Date.now() + duration
            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#a855f7", "#3b82f6", "#ec4899"],
                })
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#a855f7", "#3b82f6", "#ec4899"],
                })
                if (Date.now() < end) requestAnimationFrame(frame)
            }
            frame()

            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            })
            form.reset()
        } catch (error) {
            toast.error("Failed to send message", {
                description: error instanceof Error ? error.message : "Please try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="relative w-full overflow-hidden bg-[#030014] py-20 md:py-32">
            {/* Background Ambience */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/20 blur-[128px]" />
            </div>

            <div className="container relative mx-auto px-4 md:px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid gap-12 lg:grid-cols-2 lg:gap-24"
                >
                    {/* Left Column: Info */}
                    <div className="flex flex-col gap-8">
                        <motion.div variants={itemVariants}>
                            <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                                Ready to Build the
                                <br />
                                <span className="italic">Impossible?</span>
                            </h2>
                            <p className="mt-4 text-lg text-slate-400">
                                You have the vision. We have the engineering power.
                                Let's collaborate to build a digital product that defines your industry.
                            </p>
                        </motion.div>

                        {/* Info Cards Grid */}
                        <motion.div
                            variants={itemVariants}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            {[
                                {
                                    icon: Mail,
                                    title: "Email Us",
                                    value: "info@millionsystems.com",
                                    sub: "Send us an email anytime",
                                    href: "mailto:info@millionsystems.com",
                                },
                                {
                                    icon: Phone,
                                    title: "Call Us",
                                    value: "+44 7943 111370",
                                    sub: "Mon-Fri from 9am to 6pm",
                                    href: "tel:+447943111370",
                                },
                                {
                                    icon: MapPin,
                                    title: "Visit Us",
                                    value: "Turner Business Centre, Greengate",
                                    sub: "Middleton, Manchester M24 1RU",
                                },
                                {
                                    icon: Clock,
                                    title: "Working Hours",
                                    value: "Mon - Fri: 9:00 - 18:00",
                                    sub: "We're here to help",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-white/10"
                                >
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-1 text-lg font-semibold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mb-2 text-xs text-purple-200/50">{item.sub}</p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-300"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-300">
                                            {item.value}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* Quick Response Note */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-teal-500/20 bg-teal-500/10 p-6 backdrop-blur-md"
                        >
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-teal-500/20 p-2 text-teal-400">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-teal-100">
                                        Quick Response
                                    </h3>
                                    <p className="text-sm text-teal-200/70">
                                        Use our <span className="text-white font-medium">support chat wizard</span> to talk to us in real time about your needs.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Tabs with Form and Booking */}
                    <motion.div variants={itemVariants} className="lg:pl-8">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
                            <Tabs defaultValue="schedule" className="w-full">
                                <TabsList className="mb-6 grid w-full grid-cols-2 bg-black/20 p-1">
                                    <TabsTrigger
                                        value="schedule"
                                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Schedule a Call
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="message"
                                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </TabsTrigger>
                                </TabsList>

                                {/* Schedule a Call Tab */}
                                <TabsContent value="schedule" className="mt-0">
                                    {bookingStep === 'confirmation' && confirmedBooking ? (
                                        <BookingConfirmation
                                            booking={confirmedBooking}
                                            attendeeEmail={bookingEmail}
                                            onReset={resetBooking}
                                        />
                                    ) : bookingStep === 'form' ? (
                                        <BookingForm
                                            selectedDateTime={selectedSlot}
                                            onSubmit={handleBookingSubmit}
                                            onBack={() => setBookingStep('calendar')}
                                            isSubmitting={isBooking}
                                        />
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">
                                                    Book a Discovery Call
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Select a date and time that works for you
                                                </p>
                                            </div>

                                            <div className="grid gap-6 lg:grid-cols-2">
                                                {/* Calendar */}
                                                <div>
                                                    <CalendarPicker
                                                        selectedDate={selectedDate}
                                                        onDateSelect={handleDateSelect}
                                                        currentMonth={currentMonth}
                                                        onMonthChange={setCurrentMonth}
                                                    />
                                                </div>

                                                {/* Time Slots */}
                                                <div className="min-h-[280px]">
                                                    <TimeSlotPicker
                                                        slots={availableSlots}
                                                        selectedSlot={selectedSlot}
                                                        onSlotSelect={handleSlotSelect}
                                                        isLoading={isLoadingSlots}
                                                        timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                                                        selectedDate={selectedDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Send Message Tab */}
                                <TabsContent value="message" className="mt-0">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-white">
                                            Send us a Message
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Fill out the form below and we&apos;ll get back to you shortly.
                                        </p>
                                    </div>

                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="space-y-5"
                                        >
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-300">
                                                                First Name <span className="text-purple-400">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="John"
                                                                    className="border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-300">
                                                                Last Name <span className="text-purple-400">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Doe"
                                                                    className="border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-300">
                                                            Email Address <span className="text-purple-400">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="john@example.com"
                                                                className="border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-300">Company</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Your Company Name"
                                                                className="border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="projectType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-300">
                                                                Project Type
                                                            </FormLabel>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "w-full justify-between border-white/10 bg-black/20 text-left font-normal text-white hover:bg-white/10 hover:text-white focus:ring-purple-500/20",
                                                                                !field.value && "text-slate-600"
                                                                            )}
                                                                        >
                                                                            {field.value || "Select project type"}
                                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="max-h-[300px] w-[var(--radix-dropdown-menu-trigger-width)] border-white/10 bg-[#0a0a0f]/95 text-slate-300 backdrop-blur-xl">
                                                                    <DropdownMenuRadioGroup
                                                                        value={field.value}
                                                                        onValueChange={field.onChange}
                                                                    >
                                                                        {PROJECT_TYPES.map((type) => (
                                                                            <DropdownMenuRadioItem
                                                                                key={type}
                                                                                value={type}
                                                                                className="focus:bg-purple-500/20 focus:text-white"
                                                                            >
                                                                                {type}
                                                                            </DropdownMenuRadioItem>
                                                                        ))}
                                                                    </DropdownMenuRadioGroup>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="budget"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-300">
                                                                Budget Range
                                                            </FormLabel>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "w-full justify-between border-white/10 bg-black/20 text-left font-normal text-white hover:bg-white/10 hover:text-white focus:ring-purple-500/20",
                                                                                !field.value && "text-slate-600"
                                                                            )}
                                                                        >
                                                                            {field.value || "Select budget range"}
                                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] border-white/10 bg-[#0a0a0f]/95 text-slate-300 backdrop-blur-xl">
                                                                    <DropdownMenuRadioGroup
                                                                        value={field.value}
                                                                        onValueChange={field.onChange}
                                                                    >
                                                                        <DropdownMenuRadioItem
                                                                            value="5-10k"
                                                                            className="focus:bg-purple-500/20 focus:text-white"
                                                                        >
                                                                            $5k - $10k
                                                                        </DropdownMenuRadioItem>
                                                                        <DropdownMenuRadioItem
                                                                            value="10-25k"
                                                                            className="focus:bg-purple-500/20 focus:text-white"
                                                                        >
                                                                            $10k - $25k
                                                                        </DropdownMenuRadioItem>
                                                                        <DropdownMenuRadioItem
                                                                            value="25-50k"
                                                                            className="focus:bg-purple-500/20 focus:text-white"
                                                                        >
                                                                            $25k - $50k
                                                                        </DropdownMenuRadioItem>
                                                                        <DropdownMenuRadioItem
                                                                            value="50k+"
                                                                            className="focus:bg-purple-500/20 focus:text-white"
                                                                        >
                                                                            $50k+
                                                                        </DropdownMenuRadioItem>
                                                                    </DropdownMenuRadioGroup>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-300">
                                                            Message <span className="text-purple-400">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <textarea
                                                                className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                                placeholder="Tell us about your project..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
                                                size="lg"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
