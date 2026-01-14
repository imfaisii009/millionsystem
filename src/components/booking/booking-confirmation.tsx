"use client"

import { format, parseISO } from "date-fns"
import { Calendar, Clock, CheckCircle, Video, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface BookingConfirmationProps {
  booking: {
    uid: string
    title: string
    startTime: string
    endTime: string
    meetingUrl: string | null
  }
  attendeeEmail: string
  onReset: () => void
}

export function BookingConfirmation({
  booking,
  attendeeEmail,
  onReset,
}: BookingConfirmationProps) {
  // Trigger confetti on mount
  useEffect(() => {
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
  }, [])

  // Format the booking time
  const formatBookingTime = () => {
    try {
      const start = parseISO(booking.startTime)
      const end = parseISO(booking.endTime)
      return {
        date: format(start, "EEEE, MMMM d, yyyy"),
        time: `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`,
      }
    } catch {
      return { date: booking.startTime, time: "" }
    }
  }

  const { date, time } = formatBookingTime()

  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
        <CheckCircle className="h-10 w-10 text-green-400" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-2xl font-bold text-white">
        Meeting Scheduled!
      </h3>
      <p className="mb-8 text-slate-400">
        Your call has been booked successfully.
      </p>

      {/* Booking details card */}
      <div className="mb-8 w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
        <h4 className="mb-4 text-lg font-semibold text-white">
          {booking.title}
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-300">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Clock className="h-5 w-5 text-purple-400" />
            <span>{time}</span>
          </div>

          {booking.meetingUrl && (
            <div className="flex items-center gap-3 text-slate-300">
              <Video className="h-5 w-5 text-purple-400" />
              <a
                href={booking.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 hover:underline"
              >
                Join meeting link
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-300">
            <Mail className="h-5 w-5 text-purple-400" />
            <span>Invite sent to {attendeeEmail}</span>
          </div>
        </div>
      </div>

      {/* Info text */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3">
        <p className="text-sm text-blue-300">
          Check your email for a calendar invite with all the details. You can
          add it to your preferred calendar app.
        </p>
      </div>

      {/* Actions */}
      <Button
        onClick={onReset}
        variant="outline"
        className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
      >
        Schedule Another Meeting
      </Button>
    </div>
  )
}
