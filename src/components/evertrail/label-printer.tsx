"use client"

import { useState } from "react"
import { code128Bars } from "@/lib/evertrail/code128"

export type LabelProduct = {
  id: string
  name: string
  code: string // what the barcode holds
  price: string // already formatted, e.g. "12.99"
}

// DYMO LabelWriter label rolls. Width and height are in inches, as the label comes out of the printer.
const SIZES = [
  { key: "30334", label: 'DYMO 30334 - 2-1/4" x 1-1/4" (multi-purpose)', width: 2.25, height: 1.25 },
  { key: "30336", label: 'DYMO 30336 - 2-1/8" x 1" (small multi-purpose)', width: 2.125, height: 1 },
  { key: "30252", label: 'DYMO 30252 - 3-1/2" x 1-1/8" (address)', width: 3.5, height: 1.125 },
]

function Barcode({ value }: { value: string }) {
  const bars = code128Bars(value)
  const quiet = 10 // blank space each side so scanners can read it
  const total = (bars[0]?.total ?? 0) + quiet * 2
  return (
    <svg
      viewBox={`0 0 ${total} 10`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{ width: "100%", height: "100%", display: "block" }}
      role="img"
      aria-label={`Barcode ${value}`}
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x + quiet} y={0} width={bar.width} height={10} fill="#000" />
      ))}
    </svg>
  )
}

export function LabelPrinter({ products, preselected }: { products: LabelProduct[]; preselected: string[] }) {
  const [sizeKey, setSizeKey] = useState(SIZES[0].key)
  const [showPrice, setShowPrice] = useState(true)
  const [filter, setFilter] = useState("")
  const [copies, setCopies] = useState<Record<string, number>>(() => {
    const start: Record<string, number> = {}
    for (const id of preselected) start[id] = 1
    return start
  })

  const size = SIZES.find((s) => s.key === sizeKey) ?? SIZES[0]
  const labels = products.flatMap((p) => Array.from({ length: copies[p.id] ?? 0 }, (_, i) => ({ p, i })))
  const needle = filter.trim().toLowerCase()
  const shown = needle
    ? products.filter((p) => p.name.toLowerCase().includes(needle) || p.code.toLowerCase().includes(needle))
    : products

  function setCount(id: string, value: number) {
    const count = Math.max(0, Math.min(500, Number.isFinite(value) ? Math.floor(value) : 0))
    setCopies((old) => ({ ...old, [id]: count }))
  }

  return (
    <div>
      {/* Tells the printer the exact label size and removes page margins. */}
      <style>{`
        @page { size: ${size.width}in ${size.height}in; margin: 0; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          .et-label { border: none !important; margin: 0 !important; break-after: page; page-break-after: always; }
          .et-label:last-child { break-after: auto; page-break-after: auto; }
        }
      `}</style>

      <div className="print:hidden">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            <span className="mb-1 block">Label size</span>
            <select
              value={sizeKey}
              onChange={(e) => setSizeKey(e.target.value)}
              className="w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-base text-black"
            >
              {SIZES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium">
            <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
            Show the price on the label
          </label>
        </div>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter products"
          className="mb-3 w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-base text-black"
        />

        <div className="mb-4 max-h-72 overflow-y-auto rounded-md border border-neutral-300">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-400 text-left">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Barcode</th>
                <th className="px-3 py-2 text-right">How many labels</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="border-b border-neutral-200">
                  <td className="px-3 py-1">{p.name}</td>
                  <td className="px-3 py-1 font-mono">{p.code}</td>
                  <td className="px-3 py-1 text-right">
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={copies[p.id] ?? 0}
                      onChange={(e) => setCount(p.id, e.target.valueAsNumber)}
                      className="w-20 rounded-md border border-neutral-400 bg-white px-2 py-1 text-right text-black"
                      aria-label={`Labels for ${p.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 ? <p className="px-3 py-4 text-sm text-neutral-600">No products to show.</p> : null}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={labels.length === 0}
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            Print {labels.length} label{labels.length === 1 ? "" : "s"}
          </button>
          <span className="text-sm text-neutral-700">
            In the print window choose the DYMO printer, the same label size, and Margins: None.
          </span>
        </div>

        <h2 className="mb-2 text-lg font-semibold">Preview</h2>
        {labels.length === 0 ? (
          <p className="text-sm text-neutral-600">Set &quot;How many labels&quot; above to see a preview.</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3 print:block">
        {labels.map(({ p, i }) => (
          <div
            key={`${p.id}-${i}`}
            className="et-label"
            style={{
              width: `${size.width}in`,
              height: `${size.height}in`,
              boxSizing: "border-box",
              padding: "0.06in 0.1in",
              border: "1px dashed #999",
              background: "#fff",
              color: "#000",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            <div
              style={{
                fontSize: "9pt",
                fontWeight: 700,
                lineHeight: 1.1,
                maxHeight: "2.2em",
                overflow: "hidden",
              }}
            >
              {p.name}
            </div>
            <div style={{ flex: 1, minHeight: 0, margin: "0.03in 0" }}>
              <Barcode value={p.code} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8pt", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "monospace" }}>{p.code}</span>
              {showPrice ? <span style={{ fontWeight: 700 }}>${p.price}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
