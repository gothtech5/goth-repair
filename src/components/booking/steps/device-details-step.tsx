"use client"

import { useState } from "react"
import { getBrandsForCategory, getModelsForBrand } from "@/data/devices"
import type { DeviceCategory } from "@/types/booking"

interface DeviceDetailsStepProps {
  category: DeviceCategory
  initialBrand: string | null
  onSelectBrand: (brandId: string) => void
  onSelectModel: (modelId: string) => void
  onBack: () => void
}

export function DeviceDetailsStep({
  category,
  initialBrand,
  onSelectBrand,
  onSelectModel,
  onBack,
}: DeviceDetailsStepProps) {
  const [selectedBrand, setSelectedBrand] = useState(initialBrand ?? "")
  const brands = getBrandsForCategory(category)
  const models = selectedBrand ? getModelsForBrand(selectedBrand) : []

  const CATEGORY_COPY: Record<DeviceCategory, { label: string; tagline: string }> = {
    phone: { label: "phone", tagline: "We've fixed over 5,000 screens and counting." },
    tablet: { label: "tablet", tagline: "You're in good hands \u2014 we do 5,000 repairs every month." },
    computer: { label: "computer", tagline: "From MacBooks to ThinkPads, we've seen it all." },
    smartwatch: { label: "smartwatch", tagline: "Apple Watch experts \u2014 from Series 1 to Ultra." },
  }

  const { label: categoryLabel, tagline } = CATEGORY_COPY[category]

  function handleBrandChange(brandId: string) {
    setSelectedBrand(brandId)
    onSelectBrand(brandId)
  }

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        What kind of {categoryLabel} is it?
      </h2>
      <p className="mt-2 text-text-secondary">
        {tagline}
      </p>

      <div className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="brand-select" className="block text-sm font-medium">
            Brand
          </label>
          <select
            id="brand-select"
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border-light bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBrand && (
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium">
              Model
            </label>
            <select
              id="model-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) onSelectModel(e.target.value)
              }}
              className="mt-1.5 w-full rounded-lg border border-border-light bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border-light bg-surface/95 px-6 py-4 backdrop-blur-sm safe-area-inset-bottom">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-accent hover:underline"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </div>
  )
}
