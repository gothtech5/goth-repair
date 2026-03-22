export type DeviceCategory = "phone" | "tablet" | "computer" | "smartwatch"

export type RepairType = "walk-in" | "mail-in"

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

export interface ShippingAddress {
  street: string
  apartment: string
  city: string
  state: string
  zip: string
}

export interface BookingState {
  step: BookingStep
  category: DeviceCategory | null
  brand: string | null
  modelId: string | null
  issues: string[]
  issueDescription: string
  repairType: RepairType | null
  date: string | null
  timeSlot: string | null
  shippingAddress: ShippingAddress | null
  contact: ContactInfo | null
}

export type BookingAction =
  | { type: "SET_CATEGORY"; payload: DeviceCategory }
  | { type: "SET_BRAND"; payload: string }
  | { type: "SET_MODEL"; payload: string }
  | { type: "SET_ISSUES"; payload: { issues: string[]; description: string } }
  | { type: "SET_REPAIR_TYPE"; payload: RepairType }
  | { type: "SET_SCHEDULE"; payload: { date: string; timeSlot: string } }
  | { type: "SET_SHIPPING_ADDRESS"; payload: ShippingAddress }
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

export function getStepLabel(step: BookingStep, repairType: RepairType | null): string {
  if (step === "schedule" && repairType === "mail-in") return "Shipping"
  return STEP_LABELS[step]
}

export const INITIAL_STATE: BookingState = {
  step: "device",
  category: null,
  brand: null,
  modelId: null,
  issues: [],
  issueDescription: "",
  repairType: null,
  date: null,
  timeSlot: null,
  shippingAddress: null,
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
    case "SET_REPAIR_TYPE":
      return {
        ...state,
        repairType: action.payload,
        date: null,
        timeSlot: null,
        shippingAddress: null,
      }
    case "SET_SCHEDULE":
      return {
        ...state,
        step: "contact",
        date: action.payload.date,
        timeSlot: action.payload.timeSlot,
      }
    case "SET_SHIPPING_ADDRESS":
      return {
        ...state,
        step: "contact",
        shippingAddress: action.payload,
      }
    case "SET_CONTACT":
      return { ...state, step: "confirmation", contact: action.payload }
    case "GO_TO_STEP":
      return { ...state, step: action.payload }
    case "GO_BACK": {
      const currentIndex = STEPS.indexOf(state.step)
      if (currentIndex <= 0) return state
      const prevStep = STEPS[currentIndex - 1]
      if (prevStep === "schedule" && state.repairType) {
        return { ...state, step: prevStep }
      }
      return { ...state, step: prevStep }
    }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}
