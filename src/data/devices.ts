import type { DeviceCategory } from "@/types/booking"

export interface DeviceCategoryInfo {
  id: DeviceCategory
  name: string
  description: string
}

export interface Brand {
  id: string
  name: string
  categoryId: DeviceCategory
}

export interface DeviceModel {
  id: string
  name: string
  brandId: string
  categoryId: DeviceCategory
  generation: string
}

export interface RepairIssue {
  id: string
  name: string
  description: string
  applicableTo: DeviceCategory[]
  estimatedPrice: string
  estimatedTime: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

// ─── Categories ───

export const DEVICE_CATEGORIES: DeviceCategoryInfo[] = [
  {
    id: "phone",
    name: "Phone",
    description: "Screen, battery, charging port, camera, and more",
  },
  {
    id: "tablet",
    name: "Tablet",
    description: "Screen repair, battery replacement, and port repairs",
  },
  {
    id: "computer",
    name: "Computer",
    description: "Screen repair, battery, keyboard, and software issues",
  },
]

// ─── Brands ───

export const BRANDS: Brand[] = [
  // Phone
  { id: "apple-phone", name: "Apple", categoryId: "phone" },
  { id: "samsung-phone", name: "Samsung", categoryId: "phone" },
  { id: "google-phone", name: "Google", categoryId: "phone" },
  { id: "motorola-phone", name: "Motorola", categoryId: "phone" },
  // Tablet
  { id: "apple-tablet", name: "Apple", categoryId: "tablet" },
  { id: "samsung-tablet", name: "Samsung", categoryId: "tablet" },
  { id: "amazon-tablet", name: "Amazon", categoryId: "tablet" },
  { id: "google-tablet", name: "Google", categoryId: "tablet" },
  { id: "lenovo-tablet", name: "Lenovo", categoryId: "tablet" },
  // Computer
  { id: "apple-computer", name: "Apple", categoryId: "computer" },
  { id: "dell-computer", name: "Dell", categoryId: "computer" },
  { id: "hp-computer", name: "HP", categoryId: "computer" },
  { id: "lenovo-computer", name: "Lenovo", categoryId: "computer" },
  { id: "asus-computer", name: "Asus", categoryId: "computer" },
]

// ─── Models ───

export const DEVICE_MODELS: DeviceModel[] = [
  // ── Apple Phones ──
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-air", name: "iPhone 17 Air", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-plus", name: "iPhone 17 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17", name: "iPhone 17", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16-plus", name: "iPhone 16 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16", name: "iPhone 16", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15-plus", name: "iPhone 15 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15", name: "iPhone 15", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14-plus", name: "iPhone 14 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14", name: "iPhone 14", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },
  { id: "iphone-13-pro", name: "iPhone 13 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },
  { id: "iphone-13", name: "iPhone 13", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },

  // ── Samsung Phones ──
  { id: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s24-plus", name: "Galaxy S24+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s24", name: "Galaxy S24", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s23-ultra", name: "Galaxy S23 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-s23-plus", name: "Galaxy S23+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-s23", name: "Galaxy S23", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-a54", name: "Galaxy A54", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a34", name: "Galaxy A34", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-z-fold-5", name: "Galaxy Z Fold 5", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-5", name: "Galaxy Z Flip 5", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },

  // ── Google Phones ──
  { id: "pixel-9-pro-xl", name: "Pixel 9 Pro XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9-pro", name: "Pixel 9 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9", name: "Pixel 9", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-8-pro", name: "Pixel 8 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 8 Series" },
  { id: "pixel-8", name: "Pixel 8", brandId: "google-phone", categoryId: "phone", generation: "Pixel 8 Series" },
  { id: "pixel-7a", name: "Pixel 7a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 7 Series" },

  // ── Motorola Phones ──
  { id: "moto-edge-2024", name: "Motorola Edge (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-g-stylus-5g", name: "Moto G Stylus 5G", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Series" },
  { id: "moto-g-power-2024", name: "Moto G Power (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Series" },

  // ── Apple Tablets ──
  { id: "ipad-pro-m4", name: "iPad Pro (M4)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-m2", name: "iPad Pro (M2)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-air-m2", name: "iPad Air (M2)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-m1", name: "iPad Air (M1)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-10th", name: "iPad (10th gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-9th", name: "iPad (9th gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-mini-6", name: "iPad mini (6th gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad mini" },

  // ── Samsung Tablets ──
  { id: "galaxy-tab-s9-ultra", name: "Galaxy Tab S9 Ultra", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s9-plus", name: "Galaxy Tab S9+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s9", name: "Galaxy Tab S9", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s8", name: "Galaxy Tab S8", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S8" },
  { id: "galaxy-tab-a9", name: "Galaxy Tab A9", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },

  // ── Amazon Tablets ──
  { id: "fire-hd-10", name: "Fire HD 10", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire HD" },
  { id: "fire-hd-8", name: "Fire HD 8", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire HD" },
  { id: "fire-max-11", name: "Fire Max 11", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire Max" },

  // ── Google Tablets ──
  { id: "pixel-tablet", name: "Pixel Tablet", brandId: "google-tablet", categoryId: "tablet", generation: "Pixel Tablet" },

  // ── Lenovo Tablets ──
  { id: "lenovo-tab-p12", name: "Tab P12", brandId: "lenovo-tablet", categoryId: "tablet", generation: "Lenovo Tab P" },
  { id: "lenovo-tab-m11", name: "Tab M11", brandId: "lenovo-tablet", categoryId: "tablet", generation: "Lenovo Tab M" },

  // ── Apple Computers ──
  { id: "macbook-pro-16-m4", name: "MacBook Pro 16\" (M4)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-14-m4", name: "MacBook Pro 14\" (M4)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-16-m3", name: "MacBook Pro 16\" (M3)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-14-m3", name: "MacBook Pro 14\" (M3)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Pro" },
  { id: "macbook-pro-13-m2", name: "MacBook Pro 13\" (M2)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Pro" },
  { id: "macbook-air-15-m4", name: "MacBook Air 15\" (M4)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m4", name: "MacBook Air 13\" (M4)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "macbook-air-15-m3", name: "MacBook Air 15\" (M3)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m3", name: "MacBook Air 13\" (M3)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "macbook-air-15-m2", name: "MacBook Air 15\" (M2)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "macbook-air-13-m2", name: "MacBook Air 13\" (M2)", brandId: "apple-computer", categoryId: "computer", generation: "MacBook Air" },
  { id: "imac-m4", name: "iMac (M4)", brandId: "apple-computer", categoryId: "computer", generation: "iMac" },
  { id: "mac-mini-m4", name: "Mac mini (M4)", brandId: "apple-computer", categoryId: "computer", generation: "Mac mini" },

  // ── Dell Computers ──
  { id: "dell-xps-15", name: "XPS 15", brandId: "dell-computer", categoryId: "computer", generation: "XPS" },
  { id: "dell-xps-13", name: "XPS 13", brandId: "dell-computer", categoryId: "computer", generation: "XPS" },
  { id: "dell-inspiron-16", name: "Inspiron 16", brandId: "dell-computer", categoryId: "computer", generation: "Inspiron" },
  { id: "dell-inspiron-15", name: "Inspiron 15", brandId: "dell-computer", categoryId: "computer", generation: "Inspiron" },
  { id: "dell-latitude-7450", name: "Latitude 7450", brandId: "dell-computer", categoryId: "computer", generation: "Latitude" },

  // ── HP Computers ──
  { id: "hp-spectre-x360-16", name: "Spectre x360 16\"", brandId: "hp-computer", categoryId: "computer", generation: "Spectre" },
  { id: "hp-spectre-x360-14", name: "Spectre x360 14\"", brandId: "hp-computer", categoryId: "computer", generation: "Spectre" },
  { id: "hp-pavilion-15", name: "Pavilion 15", brandId: "hp-computer", categoryId: "computer", generation: "Pavilion" },
  { id: "hp-elitebook-840", name: "EliteBook 840", brandId: "hp-computer", categoryId: "computer", generation: "EliteBook" },

  // ── Lenovo Computers ──
  { id: "lenovo-thinkpad-x1-carbon", name: "ThinkPad X1 Carbon", brandId: "lenovo-computer", categoryId: "computer", generation: "ThinkPad" },
  { id: "lenovo-thinkpad-t14s", name: "ThinkPad T14s", brandId: "lenovo-computer", categoryId: "computer", generation: "ThinkPad" },
  { id: "lenovo-ideapad-5", name: "IdeaPad 5", brandId: "lenovo-computer", categoryId: "computer", generation: "IdeaPad" },
  { id: "lenovo-yoga-9i", name: "Yoga 9i", brandId: "lenovo-computer", categoryId: "computer", generation: "Yoga" },

  // ── Asus Computers ──
  { id: "asus-zenbook-14", name: "ZenBook 14", brandId: "asus-computer", categoryId: "computer", generation: "ZenBook" },
  { id: "asus-zenbook-s16", name: "ZenBook S 16", brandId: "asus-computer", categoryId: "computer", generation: "ZenBook" },
  { id: "asus-rog-zephyrus-g16", name: "ROG Zephyrus G16", brandId: "asus-computer", categoryId: "computer", generation: "ROG" },
  { id: "asus-vivobook-15", name: "VivoBook 15", brandId: "asus-computer", categoryId: "computer", generation: "VivoBook" },
]

// ─── Repair Issues ───

export const REPAIR_ISSUES: RepairIssue[] = [
  {
    id: "screen",
    name: "Screen Repair",
    description: "Cracked, shattered, or unresponsive display",
    applicableTo: ["phone", "tablet", "computer"],
    estimatedPrice: "From $79",
    estimatedTime: "1-2 hours",
  },
  {
    id: "battery",
    name: "Battery Replacement",
    description: "Battery draining fast or won't hold a charge",
    applicableTo: ["phone", "tablet", "computer"],
    estimatedPrice: "From $49",
    estimatedTime: "30-60 min",
  },
  {
    id: "charging-port",
    name: "Charging Port",
    description: "Device won't charge or loose connection",
    applicableTo: ["phone", "tablet"],
    estimatedPrice: "From $59",
    estimatedTime: "1-2 hours",
  },
  {
    id: "back-glass",
    name: "Back Glass",
    description: "Cracked or shattered back panel",
    applicableTo: ["phone"],
    estimatedPrice: "From $69",
    estimatedTime: "1-2 hours",
  },
  {
    id: "camera",
    name: "Camera Repair",
    description: "Blurry photos, cracked lens, or camera not working",
    applicableTo: ["phone", "tablet"],
    estimatedPrice: "From $69",
    estimatedTime: "1-2 hours",
  },
  {
    id: "speaker",
    name: "Speaker / Microphone",
    description: "No sound, muffled audio, or mic not working",
    applicableTo: ["phone", "tablet"],
    estimatedPrice: "From $59",
    estimatedTime: "1-2 hours",
  },
  {
    id: "water-damage",
    name: "Water Damage",
    description: "Device exposed to liquid or moisture",
    applicableTo: ["phone", "tablet"],
    estimatedPrice: "From $79",
    estimatedTime: "24-48 hours",
  },
  {
    id: "software",
    name: "Software Issues",
    description: "Frozen, stuck on logo, or software glitches",
    applicableTo: ["phone", "tablet", "computer"],
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
  {
    id: "virus-malware",
    name: "Virus / Malware Removal",
    description: "Slowdowns, pop-ups, or suspicious activity",
    applicableTo: ["computer"],
    estimatedPrice: "From $69",
    estimatedTime: "1-3 hours",
  },
  {
    id: "hdd-ssd-upgrade",
    name: "Hard Drive / SSD Upgrade",
    description: "More storage or faster performance",
    applicableTo: ["computer"],
    estimatedPrice: "From $99",
    estimatedTime: "1-2 hours",
  },
  {
    id: "ram-upgrade",
    name: "RAM Upgrade",
    description: "More memory for better multitasking",
    applicableTo: ["computer"],
    estimatedPrice: "From $79",
    estimatedTime: "30-60 min",
  },
  {
    id: "fan-overheating",
    name: "Fan / Overheating",
    description: "Loud fans, thermal throttling, or shutdowns",
    applicableTo: ["computer"],
    estimatedPrice: "From $59",
    estimatedTime: "1-2 hours",
  },
]

// ─── Helpers ───

export function getBrandsForCategory(categoryId: DeviceCategory): Brand[] {
  return BRANDS.filter((b) => b.categoryId === categoryId)
}

export function getModelsForBrand(brandId: string): DeviceModel[] {
  return DEVICE_MODELS.filter((m) => m.brandId === brandId)
}

export function getIssuesForCategory(categoryId: DeviceCategory): RepairIssue[] {
  return REPAIR_ISSUES.filter((i) => i.applicableTo.includes(categoryId))
}

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
