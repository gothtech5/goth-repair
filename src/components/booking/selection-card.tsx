"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

interface SelectionCardProps {
  title: string
  description?: string
  detail?: string
  selected?: boolean
  icon?: ReactNode
  variant?: "default" | "genius"
  onClick: () => void
}

export function SelectionCard({
  title,
  description,
  detail,
  selected,
  icon,
  variant = "default",
  onClick,
}: SelectionCardProps) {
  if (variant === "genius") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex w-full flex-col items-center rounded-3xl border bg-surface p-6 text-center transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg",
          selected
            ? "border-accent ring-2 ring-accent/20"
            : "border-border-light hover:border-accent",
        )}
      >
        {icon && (
          <div className={cn(
            "mb-4 flex size-16 items-center justify-center rounded-full transition-colors duration-200",
            selected ? "bg-accent-light" : "bg-surface-secondary group-hover:bg-accent-light",
          )}>
            <div className={cn(
              "transition-colors duration-200",
              selected ? "text-accent" : "text-text-secondary group-hover:text-accent",
            )}>
              {icon}
            </div>
          </div>
        )}
        <p className="text-[17px] font-semibold">{title}</p>
        {description && (
          <p className="mt-1.5 text-sm text-text-secondary text-pretty">
            {description}
          </p>
        )}
        {detail && (
          <p className="mt-3 text-xs text-text-tertiary">{detail}</p>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-5 text-left transition-colors",
        selected
          ? "border-accent bg-accent-light"
          : "border-border-light bg-surface hover:border-border",
      )}
    >
      <p className="font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
      {detail && (
        <p className="mt-2 text-sm font-medium text-accent">{detail}</p>
      )}
    </button>
  )
}
