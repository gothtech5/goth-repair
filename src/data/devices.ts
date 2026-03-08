import type { DeviceType } from "@/types/booking"

export interface DeviceTypeInfo {
  id: DeviceType
  name: string
  description: string
}

export interface DeviceModel {
  id: string
  name: string
  type: DeviceType
  generation: string
}

export interface RepairIssue {
  id: string
  name: string
  description: string
  applicableTo: DeviceType[]
  estimatedPrice: string
  estimatedTime: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export const DEVICE_TYPES: DeviceTypeInfo[] = [
  {
    id: "iphone",
    name: "iPhone",
    description: "Screen, battery, charging port, camera, and more",
  },
  {
    id: "ipad",
    name: "iPad",
    description: "Screen repair, battery replacement, and port repairs",
  },
  {
    id: "apple-watch",
    name: "Apple Watch",
    description: "Screen repair, battery replacement, and diagnostics",
  },
  {
    id: "computer",
    name: "Mac",
    description: "Screen repair, battery, keyboard, and software issues",
  },
]

export const DEVICE_MODELS: DeviceModel[] = [
  // iPhone 17 Series
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", type: "iphone", generation: "iPhone 17 Series" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", type: "iphone", generation: "iPhone 17 Series" },
  { id: "iphone-17-air", name: "iPhone 17 Air", type: "iphone", generation: "iPhone 17 Series" },
  { id: "iphone-17-plus", name: "iPhone 17 Plus", type: "iphone", generation: "iPhone 17 Series" },
  { id: "iphone-17", name: "iPhone 17", type: "iphone", generation: "iPhone 17 Series" },
  // iPhone 16 Series
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", type: "iphone", generation: "iPhone 16 Series" },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", type: "iphone", generation: "iPhone 16 Series" },
  { id: "iphone-16-plus", name: "iPhone 16 Plus", type: "iphone", generation: "iPhone 16 Series" },
  { id: "iphone-16", name: "iPhone 16", type: "iphone", generation: "iPhone 16 Series" },
  // iPhone 15 Series
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", type: "iphone", generation: "iPhone 15 Series" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", type: "iphone", generation: "iPhone 15 Series" },
  { id: "iphone-15-plus", name: "iPhone 15 Plus", type: "iphone", generation: "iPhone 15 Series" },
  { id: "iphone-15", name: "iPhone 15", type: "iphone", generation: "iPhone 15 Series" },
  // iPhone 14 Series
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", type: "iphone", generation: "iPhone 14 Series" },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", type: "iphone", generation: "iPhone 14 Series" },
  { id: "iphone-14-plus", name: "iPhone 14 Plus", type: "iphone", generation: "iPhone 14 Series" },
  { id: "iphone-14", name: "iPhone 14", type: "iphone", generation: "iPhone 14 Series" },
  // iPhone 13 Series
  { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", type: "iphone", generation: "iPhone 13 Series" },
  { id: "iphone-13-pro", name: "iPhone 13 Pro", type: "iphone", generation: "iPhone 13 Series" },
  { id: "iphone-13", name: "iPhone 13", type: "iphone", generation: "iPhone 13 Series" },
  // iPad
  { id: "ipad-pro-m4", name: "iPad Pro (M4)", type: "ipad", generation: "iPad Pro" },
  { id: "ipad-pro-m2", name: "iPad Pro (M2)", type: "ipad", generation: "iPad Pro" },
  { id: "ipad-air-m2", name: "iPad Air (M2)", type: "ipad", generation: "iPad Air" },
  { id: "ipad-air-m1", name: "iPad Air (M1)", type: "ipad", generation: "iPad Air" },
  { id: "ipad-10th", name: "iPad (10th gen)", type: "ipad", generation: "iPad" },
  { id: "ipad-9th", name: "iPad (9th gen)", type: "ipad", generation: "iPad" },
  { id: "ipad-mini-6", name: "iPad mini (6th gen)", type: "ipad", generation: "iPad mini" },
  // Apple Watch
  { id: "watch-ultra-2", name: "Apple Watch Ultra 2", type: "apple-watch", generation: "Apple Watch Ultra" },
  { id: "watch-series-10", name: "Apple Watch Series 10", type: "apple-watch", generation: "Apple Watch Series" },
  { id: "watch-series-9", name: "Apple Watch Series 9", type: "apple-watch", generation: "Apple Watch Series" },
  { id: "watch-se-2", name: "Apple Watch SE (2nd gen)", type: "apple-watch", generation: "Apple Watch SE" },
  // MacBook Pro
  { id: "macbook-pro-16-m4", name: "MacBook Pro 16\" (M4)", type: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-14-m4", name: "MacBook Pro 14\" (M4)", type: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-16-m3", name: "MacBook Pro 16\" (M3)", type: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-14-m3", name: "MacBook Pro 14\" (M3)", type: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-13-m2", name: "MacBook Pro 13\" (M2)", type: "computer", generation: "MacBook Pro" },
  // MacBook Air
  { id: "macbook-air-15-m4", name: "MacBook Air 15\" (M4)", type: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m4", name: "MacBook Air 13\" (M4)", type: "computer", generation: "MacBook Air" },
  { id: "macbook-air-15-m3", name: "MacBook Air 15\" (M3)", type: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m3", name: "MacBook Air 13\" (M3)", type: "computer", generation: "MacBook Air" },
  { id: "macbook-air-15-m2", name: "MacBook Air 15\" (M2)", type: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m2", name: "MacBook Air 13\" (M2)", type: "computer", generation: "MacBook Air" },
]

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

export function getTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let hour = 11; hour <= 20; hour++) {
    for (const minutes of [0, 30]) {
      if (hour === 20 && minutes === 30) continue
      const h = hour > 12 ? hour - 12 : hour === 12 ? 12 : hour
      const ampm = hour >= 12 ? "PM" : "AM"
      const m = minutes.toString().padStart(2, "0")
      slots.push({ time: `${h}:${m} ${ampm}`, available: true })
    }
  }
  return slots
}

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
