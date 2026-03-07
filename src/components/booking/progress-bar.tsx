"use client"

import { cn } from "@/lib/cn"
import { STEPS, STEP_LABELS, type BookingStep } from "@/types/booking"

interface ProgressBarProps {
  currentStep: BookingStep
  onStepClick: (step: BookingStep) => void
}

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  const currentIndex = STEPS.indexOf(currentStep)

  return (
    <nav className="mx-auto flex max-w-xl items-center justify-between" aria-label="Booking progress">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        const isClickable = isCompleted

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isCompleted && "bg-accent text-white cursor-pointer",
                  isCurrent && "border-2 border-accent text-accent",
                  !isCompleted && !isCurrent && "border border-border text-text-tertiary",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? "\u2713" : i + 1}
              </button>
              <span
                className={cn(
                  "hidden text-xs sm:block",
                  isCurrent ? "font-medium text-text-primary" : "text-text-tertiary",
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  i < currentIndex ? "bg-accent" : "bg-border-light",
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
