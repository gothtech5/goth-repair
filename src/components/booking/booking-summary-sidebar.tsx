"use client"

import { DEVICE_MODELS, DEVICE_CATEGORIES, BRANDS, REPAIR_ISSUES, STORE_INFO } from "@/data/devices"
import { STEPS, type BookingState, type BookingStep } from "@/types/booking"
import { Shield, Clock, Stethoscope, BadgePercent } from "lucide-react"

interface BookingSummarySidebarProps {
  state: BookingState
  onChangeStep: (step: BookingStep) => void
}

export function BookingSummarySidebar({ state, onChangeStep }: BookingSummarySidebarProps) {
  const currentIndex = STEPS.indexOf(state.step)
  const category = DEVICE_CATEGORIES.find((c) => c.id === state.category)
  const brand = BRANDS.find((b) => b.id === state.brand)
  const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
  const selectedIssues = REPAIR_ISSUES.filter((i) => state.issues.includes(i.id))

  const showDevice = currentIndex > 0 && category
  const showDetails = currentIndex > 1 && model
  const showIssues = currentIndex > 2 && selectedIssues.length > 0
  const showSchedule = currentIndex > 3 && state.date && state.timeSlot
  const showContact = currentIndex > 4 && state.contact

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-8 rounded-2xl border border-border-light bg-surface p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
          Appointment Summary
        </h3>

        <dl className="mt-4 space-y-3 text-sm">
          {showDevice && (
            <SummaryItem
              label="Device type"
              value={category.name}
              canChange={currentIndex > 0}
              onChangeClick={() => onChangeStep("device")}
            />
          )}
          {showDetails && (
            <SummaryItem
              label="Device"
              value={`${brand?.name ?? ""} ${model.name}`}
              canChange={currentIndex > 1}
              onChangeClick={() => onChangeStep("model")}
            />
          )}
          {showIssues && (
            <SummaryItem
              label={selectedIssues.length === 1 ? "Issue" : "Issues"}
              value={selectedIssues.map((i) => i.name).join(", ")}
              canChange={currentIndex > 2}
              onChangeClick={() => onChangeStep("issue")}
            />
          )}
          {showSchedule && (
            <SummaryItem
              label="Appointment"
              value={`${state.date} at ${state.timeSlot}`}
              canChange={currentIndex > 3}
              onChangeClick={() => onChangeStep("schedule")}
            />
          )}
          {showContact && state.contact && (
            <SummaryItem
              label="Contact"
              value={`${state.contact.firstName} ${state.contact.lastName}`}
              canChange={false}
            />
          )}
        </dl>

        {!showDevice && (
          <p className="mt-4 text-sm text-text-tertiary">
            Select a device to get started.
          </p>
        )}

        <div className="mt-6 border-t border-border-light pt-4">
          <p className="text-xs font-medium text-text-tertiary">{STORE_INFO.name}</p>
          <p className="mt-0.5 text-xs text-text-tertiary">
            {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} {STORE_INFO.zip}
          </p>
          <p className="mt-0.5 text-xs text-text-tertiary">{STORE_INFO.phone}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <TrustSignal icon={<Shield className="size-4" />} label="1-Year Warranty" />
          <TrustSignal icon={<Clock className="size-4" />} label="Fast Turnaround" />
          <TrustSignal icon={<Stethoscope className="size-4" />} label="Free Diagnostics" />
          <TrustSignal icon={<BadgePercent className="size-4" />} label="Price Match" />
        </div>
      </div>
    </aside>
  )
}

function SummaryItem({
  label,
  value,
  canChange,
  onChangeClick,
}: {
  label: string
  value: string
  canChange: boolean
  onChangeClick?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <dt className="text-text-tertiary">{label}</dt>
        <dd className="mt-0.5 font-medium">{value}</dd>
      </div>
      {canChange && onChangeClick && (
        <button
          type="button"
          onClick={onChangeClick}
          className="shrink-0 text-xs text-accent hover:underline"
        >
          Change
        </button>
      )}
    </div>
  )
}

function TrustSignal({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-text-tertiary">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  )
}
