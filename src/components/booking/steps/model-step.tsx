"use client"

import { DEVICE_MODELS } from "@/data/devices"
import { SelectionCard } from "@/components/booking/selection-card"
import type { DeviceType } from "@/types/booking"

interface ModelStepProps {
  deviceType: DeviceType
  onSelect: (modelId: string) => void
  onBack: () => void
}

export function ModelStep({ deviceType, onSelect, onBack }: ModelStepProps) {
  const models = DEVICE_MODELS.filter((m) => m.type === deviceType)
  const generations = [...new Set(models.map((m) => m.generation))]

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-accent hover:underline"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Select your model
      </h2>
      <p className="mt-2 text-text-secondary">
        Choose your specific device model.
      </p>
      {generations.map((gen) => (
        <div key={gen} className="mt-8">
          <h3 className="mb-3 text-sm font-medium text-text-tertiary">
            {gen}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {models
              .filter((m) => m.generation === gen)
              .map((model) => (
                <SelectionCard
                  key={model.id}
                  title={model.name}
                  onClick={() => onSelect(model.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
