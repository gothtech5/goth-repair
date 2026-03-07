"use client"

import Image from "next/image"
import { DEVICE_TYPES } from "@/data/devices"
import type { DeviceType } from "@/types/booking"

const DEVICE_IMAGES: Partial<Record<DeviceType, string>> = {
  iphone: "/images/iphone.png",
  ipad: "/images/ipad.png",
  "apple-watch": "/images/apple-watch.png",
  computer: "/images/computer.png",
}

interface DeviceTypeStepProps {
  onSelect: (deviceType: DeviceType) => void
}

export function DeviceTypeStep({ onSelect }: DeviceTypeStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        What device needs repair?
      </h2>
      <p className="mt-2 text-text-secondary">
        Select your device type to get started.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEVICE_TYPES.map((device) => {
          const imageSrc = DEVICE_IMAGES[device.id]
          return (
            <button
              key={device.id}
              type="button"
              onClick={() => onSelect(device.id)}
              className="w-full rounded-xl border border-border-light bg-surface p-5 text-left transition-colors hover:border-border"
            >
              {imageSrc && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={imageSrc}
                    alt={device.name}
                    width={200}
                    height={120}
                    className="h-[120px] w-auto object-contain"
                  />
                </div>
              )}
              <p className="font-medium">{device.name}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {device.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
