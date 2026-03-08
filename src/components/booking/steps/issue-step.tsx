"use client"

import Image from "next/image"
import {
  Droplets,
  Settings,
} from "lucide-react"
import { REPAIR_ISSUES } from "@/data/devices"
import { SelectionCard } from "@/components/booking/selection-card"
import type { DeviceType } from "@/types/booking"

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
  deviceType: DeviceType
  onSelect: (issueId: string) => void
  onBack: () => void
}

export function IssueStep({ deviceType, onSelect, onBack }: IssueStepProps) {
  const issues = REPAIR_ISSUES.filter((i) =>
    i.applicableTo.includes(deviceType),
  )

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
        What&apos;s going on?
      </h2>
      <p className="mt-2 text-text-secondary">
        Tell us what&apos;s happening so we can get you the right help.
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
            onClick={() => onSelect(issue.id)}
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
          onClick={() => onSelect("other")}
        />
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-text-tertiary">
          Not sure what&apos;s wrong? Choose any option — we&apos;ll diagnose it
          at drop-off for free.
        </p>
      </div>
    </div>
  )
}
