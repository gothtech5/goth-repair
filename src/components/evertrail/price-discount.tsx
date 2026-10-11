"use client"

import { useEffect, useId, useRef, useState } from "react"
import { dollars, readDiscount, salePriceCents, toCents } from "@/lib/evertrail/format"
import { Field, inputClass } from "@/components/evertrail/shell"

/**
 * "Price ($)" with the optional "Discount ($)" box right under it,
 * and the sale price worked out as you type.
 */
export function PriceDiscountFields({
  price = "",
  discount = "",
  pricePlaceholder,
}: {
  price?: string
  discount?: string
  pricePlaceholder?: string
}) {
  const priceRef = useRef<HTMLInputElement>(null)
  const discountRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState({ price, discount })
  const messageId = useId()

  const check = readDiscount(values.price, values.discount)
  const priceCents = toCents(values.price)
  const hasDiscount = !check.error && check.cents > 0

  function read() {
    setValues({ price: priceRef.current?.value ?? "", discount: discountRef.current?.value ?? "" })
  }

  // A wrong discount stops the form from saving (the server checks it again too).
  useEffect(() => {
    discountRef.current?.setCustomValidity(check.error)
  }, [check.error])

  // After "Add product" the form is cleared: start the sale price over too.
  useEffect(() => {
    const form = priceRef.current?.form
    if (!form) return
    const onReset = () => setTimeout(read, 0)
    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [])

  return (
    <div className="space-y-3">
      <Field label="Price ($)">
        <input
          ref={priceRef}
          name="price"
          inputMode="decimal"
          defaultValue={price}
          placeholder={pricePlaceholder}
          onChange={read}
          className={inputClass}
        />
      </Field>
      <Field label="Discount ($)">
        <input
          ref={discountRef}
          name="discount"
          inputMode="decimal"
          defaultValue={discount}
          placeholder="Optional"
          onChange={read}
          aria-invalid={check.error ? true : undefined}
          aria-describedby={messageId}
          className={inputClass + (check.error ? " border-2 border-red-600" : "")}
        />
      </Field>
      <p id={messageId} aria-live="polite" className="text-sm">
        {check.error ? (
          <span className="font-semibold text-red-700">{check.error}</span>
        ) : (
          <>
            Sale price: <span className="font-semibold">${dollars(salePriceCents(priceCents, check.cents))}</span>
            {hasDiscount ? (
              <span className="text-neutral-600">
                {" "}
                (was <s>${dollars(priceCents)}</s>)
              </span>
            ) : (
              <span className="text-neutral-600"> (no discount)</span>
            )}
          </>
        )}
      </p>
    </div>
  )
}
