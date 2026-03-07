"use client"

import { useReducer, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DEVICE_MODELS, REPAIR_ISSUES } from "@/data/devices"
import {
  bookingReducer,
  INITIAL_STATE,
  STEPS,
  type BookingStep,
  type ContactInfo,
  type DeviceType,
} from "@/types/booking"
import { ProgressBar } from "./progress-bar"
import { DeviceTypeStep } from "./steps/device-type-step"
import { ModelStep } from "./steps/model-step"
import { IssueStep } from "./steps/issue-step"
import { ScheduleStep } from "./steps/schedule-step"
import { ContactStep } from "./steps/contact-step"
import { ConfirmationStep } from "./steps/confirmation-step"

const VALID_DEVICES: DeviceType[] = ["iphone", "ipad", "apple-watch", "computer"]

export function BookingWizard() {
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const device = searchParams.get("device") as DeviceType | null
    if (device && VALID_DEVICES.includes(device) && state.step === "device") {
      dispatch({ type: "SET_DEVICE", payload: device })
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleStepClick(step: BookingStep) {
    const targetIndex = STEPS.indexOf(step)
    const currentIndex = STEPS.indexOf(state.step)
    if (targetIndex < currentIndex) {
      let tempState = state
      for (let i = currentIndex; i > targetIndex; i--) {
        tempState = bookingReducer(tempState, { type: "GO_BACK" })
      }
      for (let i = currentIndex; i > targetIndex; i--) {
        dispatch({ type: "GO_BACK" })
      }
    }
  }

  async function handleBookingSubmit(contact: ContactInfo) {
    setSubmitting(true)
    setSubmitError(null)

    const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
    const issue = REPAIR_ISSUES.find((i) => i.id === state.issueId)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: state.deviceType,
          modelName: model?.name ?? "",
          issueName: issue?.name ?? "",
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

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:py-16">
      <ProgressBar currentStep={state.step} onStepClick={handleStepClick} />
      <div className="mt-10 md:mt-14">
        {state.step === "device" && (
          <DeviceTypeStep
            onSelect={(deviceType) =>
              dispatch({ type: "SET_DEVICE", payload: deviceType })
            }
          />
        )}
        {state.step === "model" && state.deviceType && (
          <ModelStep
            deviceType={state.deviceType}
            onSelect={(modelId) =>
              dispatch({ type: "SET_MODEL", payload: modelId })
            }
            onBack={() => dispatch({ type: "GO_BACK" })}
          />
        )}
        {state.step === "issue" && state.deviceType && (
          <IssueStep
            deviceType={state.deviceType}
            onSelect={(issueId) =>
              dispatch({ type: "SET_ISSUE", payload: issueId })
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
    </div>
  )
}
