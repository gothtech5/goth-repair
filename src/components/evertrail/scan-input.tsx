"use client"

import { useEffect, useRef } from "react"

/**
 * A text box for the barcode scanner.
 * It puts the cursor back in itself every time the page refreshes
 * (the "stamp" changes on each refresh), so you can keep scanning
 * without clicking the box again.
 */
export function ScanInput({
  name,
  placeholder,
  stamp,
  className,
}: {
  name: string
  placeholder?: string
  stamp: number
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [stamp])
  return (
    <input
      ref={ref}
      name={name}
      autoFocus
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      placeholder={placeholder}
      className={className}
    />
  )
}
