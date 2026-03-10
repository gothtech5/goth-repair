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
  {
    id: "smartwatch",
    name: "Smartwatch",
    description: "Screen, battery, and band repairs",
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
  // Smartwatch
  { id: "apple-smartwatch", name: "Apple", categoryId: "smartwatch" },
]

// ─── Models ───

export const DEVICE_MODELS: DeviceModel[] = [
  // ══════════════════════════════════════
  // APPLE iPHONE
  // ══════════════════════════════════════

  // ── iPhone 17 Series ──
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-air", name: "iPhone 17 Air", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17-plus", name: "iPhone 17 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },
  { id: "iphone-17", name: "iPhone 17", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 17 Series" },

  // ── iPhone 16 Series ──
  { id: "iphone-16e", name: "iPhone 16e", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16-plus", name: "iPhone 16 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },
  { id: "iphone-16", name: "iPhone 16", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 16 Series" },

  // ── iPhone 15 Series ──
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15-plus", name: "iPhone 15 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },
  { id: "iphone-15", name: "iPhone 15", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 15 Series" },

  // ── iPhone 14 Series ──
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14-plus", name: "iPhone 14 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },
  { id: "iphone-14", name: "iPhone 14", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 14 Series" },

  // ── iPhone 13 Series ──
  { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },
  { id: "iphone-13-pro", name: "iPhone 13 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },
  { id: "iphone-13-mini", name: "iPhone 13 Mini", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },
  { id: "iphone-13", name: "iPhone 13", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 13 Series" },

  // ── iPhone 12 Series ──
  { id: "iphone-12-pro-max", name: "iPhone 12 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 12 Series" },
  { id: "iphone-12-pro", name: "iPhone 12 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 12 Series" },
  { id: "iphone-12-mini", name: "iPhone 12 Mini", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 12 Series" },
  { id: "iphone-12", name: "iPhone 12", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 12 Series" },

  // ── iPhone 11 Series ──
  { id: "iphone-11-pro-max", name: "iPhone 11 Pro Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 11 Series" },
  { id: "iphone-11-pro", name: "iPhone 11 Pro", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 11 Series" },
  { id: "iphone-11", name: "iPhone 11", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 11 Series" },

  // ── iPhone X Series ──
  { id: "iphone-xs-max", name: "iPhone XS Max", brandId: "apple-phone", categoryId: "phone", generation: "iPhone X Series" },
  { id: "iphone-xs", name: "iPhone XS", brandId: "apple-phone", categoryId: "phone", generation: "iPhone X Series" },
  { id: "iphone-xr", name: "iPhone XR", brandId: "apple-phone", categoryId: "phone", generation: "iPhone X Series" },
  { id: "iphone-x", name: "iPhone X", brandId: "apple-phone", categoryId: "phone", generation: "iPhone X Series" },

  // ── iPhone 8 Series ──
  { id: "iphone-8-plus", name: "iPhone 8 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 8 Series" },
  { id: "iphone-8", name: "iPhone 8", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 8 Series" },

  // ── iPhone 7 Series ──
  { id: "iphone-7-plus", name: "iPhone 7 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 7 Series" },
  { id: "iphone-7", name: "iPhone 7", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 7 Series" },

  // ── iPhone 6 Series ──
  { id: "iphone-6s-plus", name: "iPhone 6S Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 6 Series" },
  { id: "iphone-6s", name: "iPhone 6S", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 6 Series" },
  { id: "iphone-6-plus", name: "iPhone 6 Plus", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 6 Series" },
  { id: "iphone-6", name: "iPhone 6", brandId: "apple-phone", categoryId: "phone", generation: "iPhone 6 Series" },

  // ── iPhone SE ──
  { id: "iphone-se-3rd", name: "iPhone SE (3rd Gen, 2022)", brandId: "apple-phone", categoryId: "phone", generation: "iPhone SE" },
  { id: "iphone-se-2nd", name: "iPhone SE (2nd Gen, 2020)", brandId: "apple-phone", categoryId: "phone", generation: "iPhone SE" },
  { id: "iphone-se-1st", name: "iPhone SE (1st Gen, 2016)", brandId: "apple-phone", categoryId: "phone", generation: "iPhone SE" },

  // ══════════════════════════════════════
  // SAMSUNG PHONES
  // ══════════════════════════════════════

  // ── Galaxy S25 Series ──
  { id: "galaxy-s25-ultra", name: "Galaxy S25 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S25 Series" },
  { id: "galaxy-s25-plus", name: "Galaxy S25+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S25 Series" },
  { id: "galaxy-s25", name: "Galaxy S25", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S25 Series" },
  { id: "galaxy-s25-edge", name: "Galaxy S25 Edge", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S25 Series" },

  // ── Galaxy S24 Series ──
  { id: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s24-plus", name: "Galaxy S24+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s24", name: "Galaxy S24", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },
  { id: "galaxy-s24-fe", name: "Galaxy S24 FE", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S24 Series" },

  // ── Galaxy S23 Series ──
  { id: "galaxy-s23-ultra", name: "Galaxy S23 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-s23-plus", name: "Galaxy S23+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-s23", name: "Galaxy S23", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },
  { id: "galaxy-s23-fe", name: "Galaxy S23 FE", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S23 Series" },

  // ── Galaxy S22 Series ──
  { id: "galaxy-s22-ultra", name: "Galaxy S22 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S22 Series" },
  { id: "galaxy-s22-plus", name: "Galaxy S22+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S22 Series" },
  { id: "galaxy-s22", name: "Galaxy S22", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S22 Series" },

  // ── Galaxy S21 Series ──
  { id: "galaxy-s21-ultra", name: "Galaxy S21 Ultra 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S21 Series" },
  { id: "galaxy-s21-plus", name: "Galaxy S21+ 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S21 Series" },
  { id: "galaxy-s21", name: "Galaxy S21 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S21 Series" },
  { id: "galaxy-s21-fe", name: "Galaxy S21 FE", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S21 Series" },

  // ── Galaxy S20 Series ──
  { id: "galaxy-s20-ultra", name: "Galaxy S20 Ultra", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S20 Series" },
  { id: "galaxy-s20-plus", name: "Galaxy S20+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S20 Series" },
  { id: "galaxy-s20", name: "Galaxy S20", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S20 Series" },
  { id: "galaxy-s20-fe", name: "Galaxy S20 FE", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S20 Series" },

  // ── Galaxy S10 Series ──
  { id: "galaxy-s10-plus", name: "Galaxy S10+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S10 Series" },
  { id: "galaxy-s10", name: "Galaxy S10", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S10 Series" },
  { id: "galaxy-s10e", name: "Galaxy S10e", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S10 Series" },
  { id: "galaxy-s10-lite", name: "Galaxy S10 Lite", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S10 Series" },
  { id: "galaxy-s10-5g", name: "Galaxy S10 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S10 Series" },

  // ── Galaxy S9 Series ──
  { id: "galaxy-s9-plus", name: "Galaxy S9+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S9 Series" },
  { id: "galaxy-s9", name: "Galaxy S9", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S9 Series" },

  // ── Galaxy S8 Series ──
  { id: "galaxy-s8-plus", name: "Galaxy S8+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S8 Series" },
  { id: "galaxy-s8", name: "Galaxy S8", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S8 Series" },
  { id: "galaxy-s8-active", name: "Galaxy S8 Active", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S8 Series" },

  // ── Galaxy S7 Series ──
  { id: "galaxy-s7-edge", name: "Galaxy S7 Edge", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S7 Series" },
  { id: "galaxy-s7", name: "Galaxy S7", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S7 Series" },
  { id: "galaxy-s7-active", name: "Galaxy S7 Active", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S7 Series" },

  // ── Galaxy S6 Series ──
  { id: "galaxy-s6-edge-plus", name: "Galaxy S6 Edge+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S6 Series" },
  { id: "galaxy-s6-edge", name: "Galaxy S6 Edge", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S6 Series" },
  { id: "galaxy-s6", name: "Galaxy S6", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S6 Series" },
  { id: "galaxy-s6-active", name: "Galaxy S6 Active", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy S6 Series" },

  // ── Galaxy Note Series ──
  { id: "galaxy-note-20-ultra", name: "Galaxy Note 20 Ultra 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-20", name: "Galaxy Note 20 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-10-plus", name: "Galaxy Note 10+", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-10", name: "Galaxy Note 10", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-10-lite", name: "Galaxy Note 10 Lite", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-9", name: "Galaxy Note 9", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-8", name: "Galaxy Note 8", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },
  { id: "galaxy-note-5", name: "Galaxy Note 5", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Note Series" },

  // ── Galaxy A Series ──
  { id: "galaxy-a56", name: "Galaxy A56 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a55", name: "Galaxy A55 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a54", name: "Galaxy A54 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a53", name: "Galaxy A53 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a52", name: "Galaxy A52", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a51", name: "Galaxy A51", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a50", name: "Galaxy A50", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a36", name: "Galaxy A36 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a35", name: "Galaxy A35 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a34", name: "Galaxy A34 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a33", name: "Galaxy A33 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a32", name: "Galaxy A32", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a26", name: "Galaxy A26 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a25", name: "Galaxy A25 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a23", name: "Galaxy A23", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a22", name: "Galaxy A22", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a21", name: "Galaxy A21", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a20", name: "Galaxy A20", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a16", name: "Galaxy A16 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a15", name: "Galaxy A15", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a14", name: "Galaxy A14 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a13", name: "Galaxy A13 5G", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a12", name: "Galaxy A12", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a11", name: "Galaxy A11", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a10", name: "Galaxy A10", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },
  { id: "galaxy-a10e", name: "Galaxy A10e", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy A Series" },

  // ── Galaxy Z Series ──
  { id: "galaxy-z-fold-6", name: "Galaxy Z Fold 6", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-fold-5", name: "Galaxy Z Fold 5", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-fold-4", name: "Galaxy Z Fold 4", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-fold-3", name: "Galaxy Z Fold 3", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-7", name: "Galaxy Z Flip 7", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-6", name: "Galaxy Z Flip 6", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-5", name: "Galaxy Z Flip 5", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-4", name: "Galaxy Z Flip 4", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },
  { id: "galaxy-z-flip-3", name: "Galaxy Z Flip 3", brandId: "samsung-phone", categoryId: "phone", generation: "Galaxy Z Series" },

  // ══════════════════════════════════════
  // GOOGLE PHONES
  // ══════════════════════════════════════

  // ── Pixel 10 Series ──
  { id: "pixel-10-pro-xl", name: "Pixel 10 Pro XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 10 Series" },
  { id: "pixel-10-pro", name: "Pixel 10 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 10 Series" },
  { id: "pixel-10", name: "Pixel 10", brandId: "google-phone", categoryId: "phone", generation: "Pixel 10 Series" },

  // ── Pixel 9 Series ──
  { id: "pixel-9-pro-xl", name: "Pixel 9 Pro XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9-pro", name: "Pixel 9 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9-pro-fold", name: "Pixel 9 Pro Fold", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9a", name: "Pixel 9a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },
  { id: "pixel-9", name: "Pixel 9", brandId: "google-phone", categoryId: "phone", generation: "Pixel 9 Series" },

  // ── Pixel 8 Series ──
  { id: "pixel-8-pro", name: "Pixel 8 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 8 Series" },
  { id: "pixel-8a", name: "Pixel 8a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 8 Series" },
  { id: "pixel-8", name: "Pixel 8", brandId: "google-phone", categoryId: "phone", generation: "Pixel 8 Series" },

  // ── Pixel 7 Series ──
  { id: "pixel-7-pro", name: "Pixel 7 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 7 Series" },
  { id: "pixel-7a", name: "Pixel 7a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 7 Series" },
  { id: "pixel-7", name: "Pixel 7", brandId: "google-phone", categoryId: "phone", generation: "Pixel 7 Series" },
  { id: "pixel-fold", name: "Pixel Fold", brandId: "google-phone", categoryId: "phone", generation: "Pixel 7 Series" },

  // ── Pixel 6 Series ──
  { id: "pixel-6-pro", name: "Pixel 6 Pro", brandId: "google-phone", categoryId: "phone", generation: "Pixel 6 Series" },
  { id: "pixel-6a", name: "Pixel 6a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 6 Series" },
  { id: "pixel-6", name: "Pixel 6", brandId: "google-phone", categoryId: "phone", generation: "Pixel 6 Series" },

  // ── Pixel 5 Series ──
  { id: "pixel-5a-5g", name: "Pixel 5a 5G", brandId: "google-phone", categoryId: "phone", generation: "Pixel 5 Series" },
  { id: "pixel-5", name: "Pixel 5", brandId: "google-phone", categoryId: "phone", generation: "Pixel 5 Series" },

  // ── Pixel 4 Series ──
  { id: "pixel-4-xl", name: "Pixel 4 XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 4 Series" },
  { id: "pixel-4a-5g", name: "Pixel 4a 5G", brandId: "google-phone", categoryId: "phone", generation: "Pixel 4 Series" },
  { id: "pixel-4a", name: "Pixel 4a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 4 Series" },
  { id: "pixel-4", name: "Pixel 4", brandId: "google-phone", categoryId: "phone", generation: "Pixel 4 Series" },

  // ── Pixel 3 Series ──
  { id: "pixel-3-xl", name: "Pixel 3 XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 3 Series" },
  { id: "pixel-3a-xl", name: "Pixel 3a XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 3 Series" },
  { id: "pixel-3a", name: "Pixel 3a", brandId: "google-phone", categoryId: "phone", generation: "Pixel 3 Series" },
  { id: "pixel-3", name: "Pixel 3", brandId: "google-phone", categoryId: "phone", generation: "Pixel 3 Series" },

  // ── Pixel 2 Series ──
  { id: "pixel-2-xl", name: "Pixel 2 XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 2 Series" },
  { id: "pixel-2", name: "Pixel 2", brandId: "google-phone", categoryId: "phone", generation: "Pixel 2 Series" },

  // ── Pixel 1 Series ──
  { id: "pixel-xl", name: "Pixel XL", brandId: "google-phone", categoryId: "phone", generation: "Pixel 1 Series" },
  { id: "pixel-1", name: "Pixel", brandId: "google-phone", categoryId: "phone", generation: "Pixel 1 Series" },

  // ══════════════════════════════════════
  // MOTOROLA PHONES
  // ══════════════════════════════════════

  // ── Motorola Razr ──
  { id: "razr-plus-2024", name: "Razr+ (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Razr" },
  { id: "razr-2024", name: "Razr (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Razr" },
  { id: "razr-plus-2023", name: "Razr+ (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Razr" },
  { id: "razr-2023", name: "Razr (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Razr" },
  { id: "razr-2022", name: "Razr (2022)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Razr" },

  // ── Motorola Edge ──
  { id: "moto-edge-2025", name: "Edge (2025)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-2024", name: "Edge (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-plus-2023", name: "Edge+ (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-2023", name: "Edge (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-plus-2022", name: "Edge+ (2022)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-2022", name: "Edge (2022)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-plus-2020", name: "Edge+ (2020)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },
  { id: "moto-edge-2020", name: "Edge (2020)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola Edge" },

  // ── Motorola ThinkPhone ──
  { id: "thinkphone-25", name: "ThinkPhone 25", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola ThinkPhone" },
  { id: "thinkphone-2023", name: "ThinkPhone (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Motorola ThinkPhone" },

  // ── Moto G Stylus ──
  { id: "moto-g-stylus-5g-2025", name: "Moto G Stylus 5G (2025)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-5g-2024", name: "Moto G Stylus 5G (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-5g-2023", name: "Moto G Stylus 5G (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-5g-2022", name: "Moto G Stylus 5G (2022)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-5g-2021", name: "Moto G Stylus 5G (2021)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-2021", name: "Moto G Stylus (2021)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },
  { id: "moto-g-stylus-2020", name: "Moto G Stylus (2020)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Stylus" },

  // ── Moto G Power ──
  { id: "moto-g-power-5g-2025", name: "Moto G Power 5G (2025)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },
  { id: "moto-g-power-5g-2024", name: "Moto G Power 5G (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },
  { id: "moto-g-power-5g-2023", name: "Moto G Power 5G (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },
  { id: "moto-g-power-2022", name: "Moto G Power (2022)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },
  { id: "moto-g-power-2021", name: "Moto G Power (2021)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },
  { id: "moto-g-power-2020", name: "Moto G Power (2020)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Power" },

  // ── Moto G Play ──
  { id: "moto-g-play-2024", name: "Moto G Play (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Play" },
  { id: "moto-g-play-2023", name: "Moto G Play (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Play" },
  { id: "moto-g-play-2021", name: "Moto G Play (2021)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Play" },

  // ── Moto G 5G ──
  { id: "moto-g-5g-2025", name: "Moto G 5G (2025)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G 5G" },
  { id: "moto-g-5g-2024", name: "Moto G 5G (2024)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G 5G" },
  { id: "moto-g-5g-2023", name: "Moto G 5G (2023)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G 5G" },

  // ── Moto G Other ──
  { id: "moto-g-pure-2021", name: "Moto G Pure (2021)", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Series" },
  { id: "moto-g-fast", name: "Moto G Fast", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Series" },
  { id: "moto-g-75-5g", name: "Moto G75 5G", brandId: "motorola-phone", categoryId: "phone", generation: "Moto G Series" },

  // ══════════════════════════════════════
  // APPLE iPAD
  // ══════════════════════════════════════

  // ── iPad Pro ──
  { id: "ipad-pro-13-m4", name: "iPad Pro 13\" (M4, 2024)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-11-m4", name: "iPad Pro 11\" (M4, 2024)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-6th", name: "iPad Pro 12.9\" (6th Gen, M2)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-11-4th", name: "iPad Pro 11\" (4th Gen, M2)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-5th", name: "iPad Pro 12.9\" (5th Gen, M1)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-11-3rd", name: "iPad Pro 11\" (3rd Gen, M1)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-4th", name: "iPad Pro 12.9\" (4th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-11-2nd", name: "iPad Pro 11\" (2nd Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-3rd", name: "iPad Pro 12.9\" (3rd Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-11-1st", name: "iPad Pro 11\" (1st Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-2nd", name: "iPad Pro 12.9\" (2nd Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-12-9-1st", name: "iPad Pro 12.9\" (1st Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-10-5", name: "iPad Pro 10.5\"", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },
  { id: "ipad-pro-9-7", name: "iPad Pro 9.7\"", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Pro" },

  // ── iPad Air ──
  { id: "ipad-air-13-m3", name: "iPad Air 13\" (M3, 2025)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-11-m3", name: "iPad Air 11\" (M3, 2025)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-13-m2", name: "iPad Air 13\" (M2, 2024)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-11-m2", name: "iPad Air 11\" (M2, 2024)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-5th", name: "iPad Air (5th Gen, M1)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-4th", name: "iPad Air (4th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-3rd", name: "iPad Air (3rd Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },
  { id: "ipad-air-2", name: "iPad Air 2", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Air" },

  // ── iPad Mini ──
  { id: "ipad-mini-7", name: "iPad Mini (7th Gen, A17 Pro)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Mini" },
  { id: "ipad-mini-6", name: "iPad Mini (6th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Mini" },
  { id: "ipad-mini-5", name: "iPad Mini (5th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Mini" },
  { id: "ipad-mini-4", name: "iPad Mini 4", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad Mini" },

  // ── iPad Standard ──
  { id: "ipad-11th", name: "iPad (11th Gen, A16)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-10th", name: "iPad (10th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-9th", name: "iPad (9th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-8th", name: "iPad (8th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-7th", name: "iPad (7th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-6th", name: "iPad (6th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },
  { id: "ipad-5th", name: "iPad (5th Gen)", brandId: "apple-tablet", categoryId: "tablet", generation: "iPad" },

  // ══════════════════════════════════════
  // SAMSUNG TABLETS
  // ══════════════════════════════════════

  // ── Galaxy Tab S Series ──
  { id: "galaxy-tab-s10-ultra", name: "Galaxy Tab S10 Ultra", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S10" },
  { id: "galaxy-tab-s10-plus", name: "Galaxy Tab S10+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S10" },
  { id: "galaxy-tab-s9-ultra", name: "Galaxy Tab S9 Ultra", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s9-plus", name: "Galaxy Tab S9+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s9", name: "Galaxy Tab S9", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S9" },
  { id: "galaxy-tab-s8-ultra", name: "Galaxy Tab S8 Ultra", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S8" },
  { id: "galaxy-tab-s8-plus", name: "Galaxy Tab S8+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S8" },
  { id: "galaxy-tab-s8", name: "Galaxy Tab S8", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S8" },
  { id: "galaxy-tab-s7-fe", name: "Galaxy Tab S7 FE", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S7" },
  { id: "galaxy-tab-s7-plus", name: "Galaxy Tab S7+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S7" },
  { id: "galaxy-tab-s7", name: "Galaxy Tab S7", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S7" },
  { id: "galaxy-tab-s6-lite", name: "Galaxy Tab S6 Lite", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S6" },
  { id: "galaxy-tab-s6", name: "Galaxy Tab S6", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab S6" },

  // ── Galaxy Tab A Series ──
  { id: "galaxy-tab-a9-plus", name: "Galaxy Tab A9+", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },
  { id: "galaxy-tab-a9", name: "Galaxy Tab A9", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },
  { id: "galaxy-tab-a8", name: "Galaxy Tab A8 10.5\"", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },
  { id: "galaxy-tab-a7-lite", name: "Galaxy Tab A7 Lite", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },
  { id: "galaxy-tab-a7", name: "Galaxy Tab A7 10.4\"", brandId: "samsung-tablet", categoryId: "tablet", generation: "Galaxy Tab A" },

  // ── Amazon Tablets ──
  { id: "fire-max-11", name: "Fire Max 11", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire Max" },
  { id: "fire-hd-10", name: "Fire HD 10", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire HD" },
  { id: "fire-hd-8", name: "Fire HD 8", brandId: "amazon-tablet", categoryId: "tablet", generation: "Fire HD" },

  // ── Google Tablets ──
  { id: "pixel-tablet", name: "Pixel Tablet", brandId: "google-tablet", categoryId: "tablet", generation: "Pixel Tablet" },

  // ── Lenovo Tablets ──
  { id: "lenovo-tab-p12", name: "Tab P12", brandId: "lenovo-tablet", categoryId: "tablet", generation: "Lenovo Tab P" },
  { id: "lenovo-tab-m11", name: "Tab M11", brandId: "lenovo-tablet", categoryId: "tablet", generation: "Lenovo Tab M" },

  // ══════════════════════════════════════
  // COMPUTERS
  // ══════════════════════════════════════

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

  // ══════════════════════════════════════
  // APPLE WATCH
  // ══════════════════════════════════════

  // ── Apple Watch Ultra ──
  { id: "apple-watch-ultra-2", name: "Apple Watch Ultra 2", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Ultra" },
  { id: "apple-watch-ultra", name: "Apple Watch Ultra", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Ultra" },

  // ── Apple Watch Series ──
  { id: "apple-watch-series-10", name: "Apple Watch Series 10", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-9", name: "Apple Watch Series 9", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-8", name: "Apple Watch Series 8", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-7", name: "Apple Watch Series 7", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-6", name: "Apple Watch Series 6", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-5", name: "Apple Watch Series 5", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-4", name: "Apple Watch Series 4", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-3", name: "Apple Watch Series 3", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-2", name: "Apple Watch Series 2", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },
  { id: "apple-watch-series-1", name: "Apple Watch Series 1", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch Series" },

  // ── Apple Watch SE ──
  { id: "apple-watch-se-2nd", name: "Apple Watch SE (2nd Gen)", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch SE" },
  { id: "apple-watch-se-1st", name: "Apple Watch SE (1st Gen)", brandId: "apple-smartwatch", categoryId: "smartwatch", generation: "Apple Watch SE" },
]

// ─── Repair Issues ───

export const REPAIR_ISSUES: RepairIssue[] = [
  {
    id: "screen",
    name: "Screen Repair",
    description: "Cracked, shattered, or unresponsive display",
    applicableTo: ["phone", "tablet", "computer", "smartwatch"],
    estimatedPrice: "From $79",
    estimatedTime: "1-2 hours",
  },
  {
    id: "battery",
    name: "Battery Replacement",
    description: "Battery draining fast or won't hold a charge",
    applicableTo: ["phone", "tablet", "computer", "smartwatch"],
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
    applicableTo: ["phone", "tablet", "smartwatch"],
    estimatedPrice: "From $79",
    estimatedTime: "24-48 hours",
  },
  {
    id: "software",
    name: "Software Issues",
    description: "Frozen, stuck on logo, or software glitches",
    applicableTo: ["phone", "tablet", "computer", "smartwatch"],
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
