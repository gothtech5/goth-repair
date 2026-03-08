export type DeviceCategory = "phone" | "tablet" | "computer"

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
  agreedToTerms: boolean
  marketingOptIn: boolean
}

export interface BookingState {
  step: BookingStep
  category: DeviceCategory | null
  brand: string | null
  modelId: string | null
  issues: string[]
  issueDescription: string
  date: string | null
  timeSlot: string | null
  contact: ContactInfo | null
}

export type BookingAction =
  | { type: "SET_CATEGORY"; payload: DeviceCategory }
  | { type: "SET_BRAND"; payload: string }
  | { type: "SET_MODEL"; payload: string }
  | { type: "SET_ISSUES"; payload: { issues: string[]; description: string } }
  | { type: "SET_SCHEDULE"; payload: { date: string; timeSlot: string } }
  | { type: "SET_CONTACT"; payload: ContactInfo }
  | { type: "GO_TO_STEP"; payload: BookingStep }
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
  model: "Details",
  issue: "Issue",
  schedule: "Schedule",
  contact: "Contact",
  confirmation: "Confirm",
}

export const INITIAL_STATE: BookingState = {
  step: "device",
  category: null,
  brand: null,
  modelId: null,
  issues: [],
  issueDescription: "",
  date: null,
  timeSlot: null,
  contact: null,
}

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        step: "model",
        category: action.payload,
        brand: null,
        modelId: null,
        issues: [],
        issueDescription: "",
      }
    case "SET_BRAND":
      return { ...state, brand: action.payload, modelId: null }
    case "SET_MODEL":
      return { ...state, step: "issue", modelId: action.payload }
    case "SET_ISSUES":
      return {
        ...state,
        step: "schedule",
        issues: action.payload.issues,
        issueDescription: action.payload.description,
      }
    case "SET_SCHEDULE":
      return {
        ...state,
        step: "contact",
        date: action.payload.date,
        timeSlot: action.payload.timeSlot,
      }
    case "SET_CONTACT":
      return { ...state, step: "confirmation", contact: action.payload }
    case "GO_TO_STEP":
      return { ...state, step: action.payload }
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
