"use client"

import { useReducer, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DEVICE_MODELS, BRANDS, REPAIR_ISSUES } from "@/data/devices"
import {
  bookingReducer,
  INITIAL_STATE,
  STEPS,
  type BookingStep,
  type ContactInfo,
  type DeviceCategory,
} from "@/types/booking"
import { ProgressBar } from "./progress-bar"
import { BookingSummarySidebar } from "./booking-summary-sidebar"
import { DeviceTypeStep } from "./steps/device-type-step"
import { DeviceDetailsStep } from "./steps/device-details-step"
import { IssueStep } from "./steps/issue-step"
import { ScheduleStep } from "./steps/schedule-step"
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
    const targetIndex = STEPS.indexOf(step)
    const currentIndex = STEPS.indexOf(state.step)
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
          date: state.date,
          timeSlot: state.timeSlot,
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

  const showSidebar = state.step !== "confirmation"

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:py-16">
      <ProgressBar currentStep={state.step} onStepClick={handleStepClick} />
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
          {state.step === "schedule" && (
            <ScheduleStep
              onSelect={(date, timeSlot) =>
                dispatch({ type: "SET_SCHEDULE", payload: { date, timeSlot } })
              }
              onBack={() => dispatch({ type: "GO_BACK" })}
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
