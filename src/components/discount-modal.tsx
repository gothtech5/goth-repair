"use client"

import { useState, useEffect } from "react"

export default function DiscountModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Special Offer 🎉</h2>
        <p className="mb-4">
          Enjoy a <strong>10% discount</strong> on your next repair. Use code <code>GOTH10</code> at checkout.
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover"
        >
          Close
        </button>
      </div>
    </div>
  )
}
