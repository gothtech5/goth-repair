"use client"

import { useReducer, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DEVICE_MODELS, BRANDS, REPAIR_ISSUES } from "@/data/devices"
import { MapPin, Truck } from "lucide-react"
import {
  bookingReducer,
  INITIAL_STATE,
  type BookingStep,
  type ContactInfo,
  type DeviceCategory,
  type RepairType,
  type ShippingAddress,
} from "@/types/booking"
import { ProgressBar } from "./progress-bar"
import { BookingSummarySidebar } from "./booking-summary-sidebar"
import { DeviceTypeStep } from "./steps/device-type-step"
import { DeviceDetailsStep } from "./steps/device-details-step"
import { IssueStep } from "./steps/issue-step"
import { ScheduleStep } from "./steps/schedule-step"
import { ShippingStep } from "./steps/shipping-step"
import { ContactStep } from "./steps/contact-step"
import { ConfirmationStep } from "./steps/confirmation-step"

const VALID_CATEGORIES: DeviceCategory[] = ["phone", "tablet", "computer"]

export function BookingWizard() {
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const category = searchParams.get("category") as DeviceCategory | null
    if (category && VALID_CATEGORIES.includes(category) && state.step === "device") {
      dispatch({ type: "SET_CATEGORY", payload: category })
      const brand = searchParams.get("brand")
      if (brand) {
        dispatch({ type: "SET_BRAND", payload: brand })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleStepClick(step: BookingStep) {
    const targetIndex = currentSteps.indexOf(step)
    const currentIndex = currentSteps.indexOf(state.step)
    if (targetIndex < currentIndex) {
      dispatch({ type: "GO_TO_STEP", payload: step })
    }
  }

  async function handleBookingSubmit(contact: ContactInfo) {
    setSubmitting(true)
    setSubmitError(null)

    const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
    const brand = BRANDS.find((b) => b.id === state.brand)
    const selectedIssues = REPAIR_ISSUES.filter((i) => state.issues.includes(i.id))

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: state.category,
          brand: brand?.name ?? "",
          modelName: model?.name ?? "",
          issues: selectedIssues.map((i) => i.name),
          issueDescription: state.issueDescription,
          repairType: state.repairType ?? "walk-in",
          date: state.date,
          timeSlot: state.timeSlot,
          shippingAddress: state.shippingAddress,
          contact,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? "Booking failed")
      }

      dispatch({ type: "SET_CONTACT", payload: contact })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const currentSteps = ["device", "model", "issue", "schedule", "contact", "confirmation"] as BookingStep[]
  const showSidebar = state.step !== "confirmation"
  const isMailIn = state.repairType === "mail-in"

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:py-16">
      <ProgressBar currentStep={state.step} repairType={state.repairType} onStepClick={handleStepClick} />
      <div className={showSidebar ? "mt-10 grid gap-10 md:mt-14 lg:grid-cols-[1fr_300px]" : "mt-10 md:mt-14"}>
        <div>
          {state.step === "device" && (
            <DeviceTypeStep
              onSelect={(category) =>
                dispatch({ type: "SET_CATEGORY", payload: category })
              }
            />
          )}
          {state.step === "model" && state.category && (
            <DeviceDetailsStep
              category={state.category}
              initialBrand={state.brand}
              onSelectBrand={(brandId) =>
                dispatch({ type: "SET_BRAND", payload: brandId })
              }
              onSelectModel={(modelId) =>
                dispatch({ type: "SET_MODEL", payload: modelId })
              }
              onBack={() => dispatch({ type: "GO_BACK" })}
            />
          )}
          {state.step === "issue" && state.category && (
            <IssueStep
              category={state.category}
              onSubmit={(issues, description) =>
                dispatch({ type: "SET_ISSUES", payload: { issues, description } })
              }
              onBack={() => dispatch({ type: "GO_BACK" })}
            />
          )}
          {state.step === "schedule" && !state.repairType && (
            <RepairTypePicker
              onSelect={(type) => dispatch({ type: "SET_REPAIR_TYPE", payload: type })}
              onBack={() => dispatch({ type: "GO_BACK" })}
            />
          )}
          {state.step === "schedule" && state.repairType === "walk-in" && (
            <ScheduleStep
              onSelect={(date, timeSlot) =>
                dispatch({ type: "SET_SCHEDULE", payload: { date, timeSlot } })
              }
              onBack={() => dispatch({ type: "CLEAR_REPAIR_TYPE" })}
            />
          )}
          {state.step === "schedule" && isMailIn && (
            <ShippingStep
              onSubmit={(address: ShippingAddress) =>
                dispatch({ type: "SET_SHIPPING_ADDRESS", payload: address })
              }
              onBack={() => dispatch({ type: "CLEAR_REPAIR_TYPE" })}
            />
          )}
          {state.step === "contact" && (
            <ContactStep
              state={state}
              onSubmit={handleBookingSubmit}
              onBack={() => dispatch({ type: "GO_BACK" })}
              submitting={submitting}
              submitError={submitError}
            />
          )}
          {state.step === "confirmation" && (
            <ConfirmationStep
              state={state}
              onReset={() => dispatch({ type: "RESET" })}
            />
          )}
        </div>
        {showSidebar && (
          <BookingSummarySidebar
            state={state}
            onChangeStep={handleStepClick}
          />
        )}
      </div>
    </div>
  )
}

function RepairTypePicker({ onSelect, onBack }: { onSelect: (type: RepairType) => void; onBack: () => void }) {
  return (
    <div className="pb-24">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        How would you like to get your device to us?
      </h2>
      <p className="mt-2 text-text-secondary">
        Walk in to our Minneapolis location or ship your device from anywhere in the US.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:max-w-lg">
        <button
          type="button"
          onClick={() => onSelect("walk-in")}
          className="flex flex-col items-center gap-3 rounded-2xl border border-border-light p-6 text-center hover:border-accent hover:bg-surface-secondary"
        >
          <MapPin className="size-8 text-accent" />
          <span className="text-lg font-semibold">Walk In</span>
          <span className="text-sm text-text-secondary">Visit our shop in Minneapolis</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("mail-in")}
          className="flex flex-col items-center gap-3 rounded-2xl border border-border-light p-6 text-center hover:border-accent hover:bg-surface-secondary"
        >
          <Truck className="size-8 text-accent" />
          <span className="text-lg font-semibold">Ship It In</span>
          <span className="text-sm text-text-secondary">Mail your device from anywhere</span>
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border-light bg-surface/95 px-6 py-4 backdrop-blur-sm safe-area-inset-bottom">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-accent hover:underline"
          >
            &larr; Back
          </button>
          <div />
        </div>
      </div>
    </div>
  )
}
