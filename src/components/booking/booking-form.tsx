"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { ArrowLeft, Calendar, Clock, Loader2, Send, ChevronDown } from "lucide-react"
import { bookingFormSchema, type BookingFormData } from "@/schemas/booking.schema"
import { PROJECT_TYPES } from "@/types/booking"
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
import { cn } from "@/lib/utils"

interface BookingFormProps {
  selectedDateTime: string | null
  onSubmit: (data: BookingFormData) => void
  onBack: () => void
  isSubmitting?: boolean
}

export function BookingForm({
  selectedDateTime,
  onSubmit,
  onBack,
  isSubmitting = false,
}: BookingFormProps) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      notes: "",
    },
  })

  // Format the selected date/time for display
  const formattedDateTime = selectedDateTime
    ? (() => {
        try {
          const date = parseISO(selectedDateTime)
          return {
            date: format(date, "EEEE, MMMM d, yyyy"),
            time: format(date, "h:mm a"),
          }
        } catch {
          return null
        }
      })()
    : null

  return (
    <div className="w-full">
      {/* Back button and selected time summary */}
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change time
        </Button>

        {formattedDateTime && (
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
            <h4 className="mb-2 text-sm font-medium text-purple-300">
              Your appointment
            </h4>
            <div className="flex flex-col gap-1 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                {formattedDateTime.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                {formattedDateTime.time}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Full Name <span className="text-purple-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Email Address <span className="text-purple-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
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

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Project Type</FormLabel>
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
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Additional Notes
                </FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-600 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us briefly about your project or questions..."
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
                Scheduling...
              </>
            ) : (
              <>
                Schedule Meeting
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-slate-500">
            You&apos;ll receive a calendar invite at your email address
          </p>
        </form>
      </Form>
    </div>
  )
}
