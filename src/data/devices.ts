export type DeviceType = "iphone" | "ipad" | "apple-watch" | "computer"

export interface RepairIssue {
  id: string
  name: string
  description: string
  applicableTo: DeviceType[]
  estimatedPrice: string
  estimatedTime: string
}

export const BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0HQi3cH4TA-YxmcUiNUESEaUvCkkhWZsCnHFZy4O-QicLBwSyKA6o5WwX5D6N10piWx8gxVRN7"

export const REPAIR_ISSUES: RepairIssue[] = [
  {
    id: "screen",
    name: "Screen Repair",
    description: "Cracked, shattered, or unresponsive display",
    applicableTo: ["iphone", "ipad", "apple-watch", "computer"],
    estimatedPrice: "From $79",
    estimatedTime: "1-2 hours",
  },
  {
    id: "battery",
    name: "Battery Replacement",
    description: "Battery draining fast or won't hold a charge",
    applicableTo: ["iphone", "ipad", "apple-watch", "computer"],
    estimatedPrice: "From $49",
    estimatedTime: "30-60 min",
  },
  {
    id: "charging-port",
    name: "Charging Port",
    description: "Device won't charge or loose connection",
    applicableTo: ["iphone", "ipad"],
    estimatedPrice: "From $59",
    estimatedTime: "1-2 hours",
  },
  {
    id: "back-glass",
    name: "Back Glass",
    description: "Cracked or shattered back panel",
    applicableTo: ["iphone"],
    estimatedPrice: "From $69",
    estimatedTime: "1-2 hours",
  },
  {
    id: "camera",
    name: "Camera Repair",
    description: "Blurry photos, cracked lens, or camera not working",
    applicableTo: ["iphone", "ipad"],
    estimatedPrice: "From $69",
    estimatedTime: "1-2 hours",
  },
  {
    id: "speaker",
    name: "Speaker / Microphone",
    description: "No sound, muffled audio, or mic not working",
    applicableTo: ["iphone", "ipad"],
    estimatedPrice: "From $59",
    estimatedTime: "1-2 hours",
  },
  {
    id: "water-damage",
    name: "Water Damage",
    description: "Device exposed to liquid or moisture",
    applicableTo: ["iphone", "ipad", "apple-watch"],
    estimatedPrice: "From $79",
    estimatedTime: "24-48 hours",
  },
  {
    id: "software",
    name: "Software Issues",
    description: "Frozen, stuck on logo, or software glitches",
    applicableTo: ["iphone", "ipad", "apple-watch", "computer"],
    estimatedPrice: "From $39",
    estimatedTime: "30-60 min",
  },
  {
    id: "keyboard",
    name: "Keyboard Repair",
    description: "Stuck, unresponsive, or damaged keys",
    applicableTo: ["computer"],
    estimatedPrice: "From $129",
    estimatedTime: "2-3 days",
  },
]

export const STORE_INFO = {
  name: "GothTech",
  address: "200 W Lake St #203",
  city: "Minneapolis",
  state: "MN",
  zip: "55408",
  phone: "(612)-987-8107",
  hours: [
    { day: "Every Day", time: "11:00 AM - 9:00 PM" },
  ],
} as const
