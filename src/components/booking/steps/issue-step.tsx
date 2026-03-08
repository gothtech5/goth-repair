"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Droplets,
  Settings,
} from "lucide-react"
import { getIssuesForCategory } from "@/data/devices"
import { SelectionCard } from "@/components/booking/selection-card"
import type { DeviceCategory } from "@/types/booking"

const ISSUE_ICONS: Record<string, React.ReactNode> = {
  "water-damage": <Droplets className="size-7 text-blue-500" />,
  software: <Settings className="size-7" />,
}

const ISSUE_IMAGES: Record<string, string> = {
  screen: "/images/screen-repair.png",
  battery: "/images/battery.jpg",
  "charging-port": "/images/charging-port.jpg",
  "back-glass": "/images/back-glass.jpg",
  camera: "/images/camera.jpg",
  speaker: "/images/speaker.jpg",
  keyboard: "/images/keyboard.jpg",
}

function IssueIcon({ issueId }: { issueId: string }) {
  const imageSrc = ISSUE_IMAGES[issueId]
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt=""
        width={80}
        height={80}
        className="size-16 object-contain"
      />
    )
  }
  const icon = ISSUE_ICONS[issueId]
  if (icon) return <>{icon}</>
  return null
}

interface IssueStepProps {
  category: DeviceCategory
  onSubmit: (issues: string[], description: string) => void
  onBack: () => void
}

export function IssueStep({ category, onSubmit, onBack }: IssueStepProps) {
  const issues = getIssuesForCategory(category)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [description, setDescription] = useState("")

  function toggleIssue(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const canContinue = selected.size > 0

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
        What&apos;s wrong with it?
      </h2>
      <p className="mt-2 text-text-secondary">
        Select all that apply — we&apos;ll diagnose everything at drop-off.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {issues.map((issue) => (
          <SelectionCard
            key={issue.id}
            variant="genius"
            icon={<IssueIcon issueId={issue.id} />}
            title={issue.name}
            description={issue.description}
            detail={issue.estimatedTime}
            selected={selected.has(issue.id)}
            onClick={() => toggleIssue(issue.id)}
          />
        ))}
        <SelectionCard
          variant="genius"
          icon={
            <Image
              src="/images/something-else.png"
              alt=""
              width={80}
              height={80}
              className="size-16 object-contain"
            />
          }
          title="Something Else?"
          description="Don't see your issue? We'll diagnose it for free"
          selected={selected.has("other")}
          onClick={() => toggleIssue("other")}
        />
      </div>

      <div className="mt-6 max-w-lg">
        <label htmlFor="issue-description" className="block text-sm font-medium">
          Describe the issue <span className="text-text-tertiary">(optional)</span>
        </label>
        <textarea
          id="issue-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Any additional details that might help us prepare..."
          className="mt-1.5 w-full rounded-lg border border-border-light px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => onSubmit([...selected], description)}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-40"
        >
          Continue
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-tertiary">
          Not sure what&apos;s wrong? Choose &ldquo;Something Else&rdquo; — we&apos;ll diagnose it
          at drop-off for free.
        </p>
      </div>
    </div>
  )
}
