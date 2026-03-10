"use client"

import Image from "next/image"
import { DEVICE_CATEGORIES } from "@/data/devices"
import type { DeviceCategory } from "@/types/booking"

const CATEGORY_IMAGES: Partial<Record<DeviceCategory, string>> = {
  phone: "/images/iphone.png",
  tablet: "/images/samsung-tablet.png",
  computer: "/images/computer.png",
  smartwatch: "/images/smartwatch.png",
}

interface DeviceTypeStepProps {
  onSelect: (category: DeviceCategory) => void
}

export function DeviceTypeStep({ onSelect }: DeviceTypeStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        What device needs repair?
      </h2>
      <p className="mt-2 text-text-secondary">
        Get a free consultation and fast repair.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEVICE_CATEGORIES.map((category) => {
          const imageSrc = CATEGORY_IMAGES[category.id]
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className="w-full rounded-xl border border-border-light bg-surface p-5 text-left transition-colors hover:border-border"
            >
              {imageSrc && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    width={200}
                    height={120}
                    className="h-[120px] w-auto object-contain"
                  />
                </div>
              )}
              <p className="font-medium">{category.name}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {category.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
