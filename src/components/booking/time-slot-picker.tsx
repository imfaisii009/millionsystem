"use client"

import { format, parseISO } from "date-fns"
import { Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
  slots: string[]
  selectedSlot: string | null
  onSlotSelect: (slot: string) => void
  isLoading?: boolean
  timeZone: string
  selectedDate: Date | null
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading = false,
  timeZone,
  selectedDate,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-3 text-sm text-slate-400">Loading available times...</p>
      </div>
    )
  }

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-10 w-10 text-slate-600" />
        <p className="mt-3 text-sm text-slate-400">
          Select a date to see available times
        </p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-10 w-10 text-slate-600" />
        <p className="mt-3 text-sm text-slate-400">
          No available times for this date
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Please select a different date
        </p>
      </div>
    )
  }

  // Format time for display
  const formatSlotTime = (isoTime: string) => {
    try {
      const date = parseISO(isoTime)
      return format(date, "h:mm a")
    } catch {
      return isoTime
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">
          Available times for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
        </h4>
        <span className="text-xs text-slate-500">{timeZone}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSlotSelect(slot)}
              className={cn(
                "flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                isSelected
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-white/10 text-slate-300 hover:border-purple-500/50 hover:bg-white/5"
              )}
            >
              <Clock className="mr-2 h-3.5 w-3.5" />
              {formatSlotTime(slot)}
            </button>
          )
        })}
      </div>

      {selectedSlot && (
        <div className="mt-4 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-3">
          <p className="text-sm text-purple-300">
            <span className="font-medium">Selected:</span>{" "}
            {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at{" "}
            {formatSlotTime(selectedSlot)}
          </p>
        </div>
      )}
    </div>
  )
}
