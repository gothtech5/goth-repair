export type DeviceType = "iphone" | "ipad" | "apple-watch" | "computer"

export type BookingStep =
  | "device"
  | "model"
  | "issue"
  | "schedule"
  | "contact"
  | "confirmation"

export interface ContactInfo {
  firstName: string
  lastName: string
  phone: string
  email: string
  notes: string
}

export interface BookingState {
  step: BookingStep
  deviceType: DeviceType | null
  modelId: string | null
  issueId: string | null
  date: string | null
  timeSlot: string | null
  contact: ContactInfo | null
}

export type BookingAction =
  | { type: "SET_DEVICE"; payload: DeviceType }
  | { type: "SET_MODEL"; payload: string }
  | { type: "SET_ISSUE"; payload: string }
  | { type: "SET_SCHEDULE"; payload: { date: string; timeSlot: string } }
  | { type: "SET_CONTACT"; payload: ContactInfo }
  | { type: "GO_BACK" }
  | { type: "RESET" }

export const STEPS: BookingStep[] = [
  "device",
  "model",
  "issue",
  "schedule",
  "contact",
  "confirmation",
]

export const STEP_LABELS: Record<BookingStep, string> = {
  device: "Device",
  model: "Model",
  issue: "Issue",
  schedule: "Schedule",
  contact: "Contact",
  confirmation: "Confirm",
}

export const INITIAL_STATE: BookingState = {
  step: "device",
  deviceType: null,
  modelId: null,
  issueId: null,
  date: null,
  timeSlot: null,
  contact: null,
}

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "SET_DEVICE":
      return { ...state, step: "model", deviceType: action.payload, modelId: null, issueId: null }
    case "SET_MODEL":
      return { ...state, step: "issue", modelId: action.payload, issueId: null }
    case "SET_ISSUE":
      return { ...state, step: "schedule", issueId: action.payload }
    case "SET_SCHEDULE":
      return { ...state, step: "contact", date: action.payload.date, timeSlot: action.payload.timeSlot }
    case "SET_CONTACT":
      return { ...state, step: "confirmation", contact: action.payload }
    case "GO_BACK": {
      const currentIndex = STEPS.indexOf(state.step)
      if (currentIndex <= 0) return state
      const prevStep = STEPS[currentIndex - 1]
      return { ...state, step: prevStep }
    }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}
