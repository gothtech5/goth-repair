"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/cn"

interface TimeSlot {
  time: string
  available: boolean
}

interface ScheduleStepProps {
  onSelect: (date: string, timeSlot: string) => void
  onBack: () => void
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function formatSelectedDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function ScheduleStep({ onSelect, onBack }: ScheduleStepProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    let cancelled = false
    setLoading(true)
    setFetchError(null)
    setSelectedTime(null)

    fetch(`/api/bookings/availability?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load availability")
        return res.json()
      })
      .then((data: { slots: TimeSlot[] }) => {
        if (!cancelled) setSlots(data.slots)
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Something went wrong")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [selectedDate])

  const morningSlots = slots.filter((s) => s.time.includes("AM"))
  const afternoonSlots = slots.filter((s) => s.time.includes("PM"))

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  function isDateDisabled(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day)
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true
    return false
  }

  function isToday(day: number): boolean {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    )
  }

  function formatDate(day: number): string {
    const m = (viewMonth + 1).toString().padStart(2, "0")
    const d = day.toString().padStart(2, "0")
    return `${viewYear}-${m}-${d}`
  }

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth())

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-accent hover:underline"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {selectedDate ? "Pick a time" : "Pick a date"}
      </h2>
      <p className="mt-2 text-text-secondary">
        {selectedDate
          ? formatSelectedDate(selectedDate)
          : "Choose a day for your appointment."}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Calendar Card */}
        <div className="rounded-2xl border border-border-light bg-surface p-5 md:p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className={cn(
                "flex size-8 items-center justify-center rounded-lg",
                canGoPrev ? "hover:bg-surface-secondary" : "text-text-tertiary cursor-not-allowed",
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="flex size-8 items-center justify-center rounded-lg hover:bg-surface-secondary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 text-center text-xs font-medium text-text-tertiary">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center text-sm">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = formatDate(day)
              const disabled = isDateDisabled(day)
              const isSelected = selectedDate === dateStr
              const todayMark = isToday(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "relative mx-auto my-0.5 flex size-9 items-center justify-center rounded-full tabular-nums transition-colors",
                    disabled && "text-text-tertiary/40 cursor-not-allowed",
                    !disabled && !isSelected && "hover:bg-surface-secondary",
                    isSelected && "bg-accent text-white font-medium",
                    todayMark && !isSelected && "font-semibold text-accent",
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex flex-col">
          {!selectedDate && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border-light py-16 text-center">
              <Clock className="size-8 text-text-tertiary/50" />
              <p className="mt-3 text-sm text-text-tertiary">
                Select a date to see available times
              </p>
            </div>
          )}

          {selectedDate && loading && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border-light py-16 text-center">
              <Loader2 className="size-8 text-accent animate-spin" />
              <p className="mt-3 text-sm text-text-tertiary">
                Checking availability...
              </p>
            </div>
          )}

          {selectedDate && fetchError && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border-light py-16 text-center">
              <p className="text-sm text-destructive">{fetchError}</p>
              <button
                type="button"
                onClick={() => setSelectedDate(selectedDate)}
                className="mt-3 text-sm text-accent hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {selectedDate && !loading && !fetchError && slots.length > 0 && (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-sm text-accent hover:underline lg:hidden"
              >
                &larr; Change date
              </button>

              <TimeSlotGroup label="Morning" slots={morningSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />
              <TimeSlotGroup label="Afternoon" slots={afternoonSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />

              {selectedTime && (
                <button
                  type="button"
                  onClick={() => onSelect(selectedDate, selectedTime)}
                  className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimeSlotGroup({
  label,
  slots,
  selectedTime,
  onSelect,
}: {
  label: string
  slots: TimeSlot[]
  selectedTime: string | null
  onSelect: (time: string) => void
}) {
  if (slots.length === 0) return null
  const allTaken = slots.every((s) => !s.available)

  return (
    <div>
      <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-text-tertiary">
        {label}
        {allTaken && <span className="ml-2 normal-case text-destructive">fully booked</span>}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "rounded-xl border py-2.5 text-sm tabular-nums transition-colors",
              !slot.available && "border-border-light bg-surface-secondary text-text-tertiary/40 cursor-not-allowed line-through",
              slot.available && selectedTime === slot.time
                ? "border-accent bg-accent text-white font-medium"
                : slot.available && "border-border-light bg-surface hover:border-accent hover:text-accent",
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}
