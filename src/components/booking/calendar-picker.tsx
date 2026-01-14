"use client"

import { useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarPickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
  minDate?: Date
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  minDate = new Date(),
}: CalendarPickerProps) {
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate))
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-white">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isPast = isPastDate(day)
          const isTodayDate = isToday(day)

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => !isPast && isCurrentMonth && onDateSelect(day)}
              disabled={isPast || !isCurrentMonth}
              className={cn(
                "relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all",
                // Base styles
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                // Current month
                isCurrentMonth ? "text-white" : "text-slate-700",
                // Past dates
                isPast && "cursor-not-allowed text-slate-700 opacity-50",
                // Today
                isTodayDate && !isSelected && "border border-purple-500/50 text-purple-400",
                // Selected
                isSelected && "bg-purple-600 text-white",
                // Hover (only for valid dates)
                !isPast && isCurrentMonth && !isSelected && "hover:bg-white/10"
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-purple-500/50" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-purple-600" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  )
}
