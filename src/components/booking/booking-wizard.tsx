"use client"

import { useReducer, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  bookingReducer,
  INITIAL_STATE,
  STEPS,
  type BookingStep,
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
            onSubmit={(contact) =>
              dispatch({ type: "SET_CONTACT", payload: contact })
            }
            onBack={() => dispatch({ type: "GO_BACK" })}
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
