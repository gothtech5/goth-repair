"use client"

import { useEffect, useRef, useState } from "react"

// Minimal description of the parts of the ZXing library this file uses.
// The library itself is the file public/vendor/zxing-browser.min.js.
type ScanControls = { stop: () => void }
type ScanResult = { getText: () => string }
type ZXing = {
  BarcodeFormat: Record<string, number>
  BrowserMultiFormatReader: new (
    hints?: Map<number, unknown>,
    options?: { delayBetweenScanAttempts?: number; delayBetweenScanSuccess?: number }
  ) => {
    decodeFromConstraints: (
      constraints: MediaStreamConstraints,
      video: HTMLVideoElement,
      onResult: (result: ScanResult | undefined, error: unknown, controls: ScanControls) => void
    ) => Promise<ScanControls>
  }
}

const LIBRARY_URL = "/vendor/zxing-browser.min.js"
// ZXing "hint" numbers: 2 = which barcode types to look for, 3 = try harder.
const HINT_POSSIBLE_FORMATS = 2
const HINT_TRY_HARDER = 3
// Product barcodes (UPC, EAN) plus the kinds printed by Evertrail labels (Code 128) and common warehouse labels.
const FORMATS = ["UPC_A", "UPC_E", "EAN_13", "EAN_8", "CODE_128", "CODE_39", "ITF"]

let libraryPromise: Promise<ZXing> | null = null

/** Downloads the barcode library the first time the camera is used. */
function loadLibrary(): Promise<ZXing> {
  const existing = (window as unknown as { ZXingBrowser?: ZXing }).ZXingBrowser
  if (existing) return Promise.resolve(existing)
  if (!libraryPromise) {
    libraryPromise = new Promise<ZXing>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = LIBRARY_URL
      script.async = true
      script.onload = () => {
        const loaded = (window as unknown as { ZXingBrowser?: ZXing }).ZXingBrowser
        if (loaded) resolve(loaded)
        else reject(new Error("Barcode library did not load."))
      }
      script.onerror = () => {
        libraryPromise = null
        reject(new Error("Barcode library could not be downloaded."))
      }
      document.head.appendChild(script)
    })
  }
  return libraryPromise
}

/** Turns a camera error into a message a person can act on. */
function cameraMessage(error: unknown): string {
  const name = error instanceof Error ? error.name : ""
  if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") {
    return (
      "Camera permission was denied, so the camera cannot scan. " +
      'On iPhone: tap the "aA" (or page menu) button in the Safari address bar, tap Website Settings, set Camera to Allow, then reload this page. ' +
      "You can still type the barcode in the box below."
    )
  }
  if (name === "NotFoundError" || name === "OverconstrainedError" || name === "DevicesNotFoundError") {
    return "No camera was found on this device. You can still type the barcode in the box below."
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return "The camera is busy in another app or tab. Close it there and try again."
  }
  const detail = error instanceof Error ? error.message : String(error)
  return "The camera could not start: " + detail
}

/**
 * "Scan with camera" button for the Scan page.
 * When it reads a barcode it types it into the existing box (the input named
 * `inputName` inside the form with id `formId`) and submits that form,
 * exactly like pressing "Look up".
 */
export function CameraScanner({ formId, inputName }: { formId: string; inputName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<ScanControls | null>(null)
  const doneRef = useRef(false)
  const [status, setStatus] = useState<"off" | "starting" | "on">("off")
  const [message, setMessage] = useState("")

  function stop() {
    controlsRef.current?.stop()
    controlsRef.current = null
    // Belt and braces: make sure the camera light goes off.
    const video = videoRef.current
    const stream = video?.srcObject
    if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop())
    if (video) video.srcObject = null
  }

  // Turn the camera off if the person leaves the page.
  useEffect(() => stop, [])

  function applyBarcode(text: string) {
    if (doneRef.current) return
    doneRef.current = true
    stop()
    setStatus("off")
    const form = document.getElementById(formId) as HTMLFormElement | null
    const input = form?.elements.namedItem(inputName)
    if (!form || !(input instanceof HTMLInputElement)) {
      setMessage(`Read ${text}, but could not find the barcode box. Type it in below.`)
      return
    }
    input.value = text
    if (typeof form.requestSubmit === "function") form.requestSubmit()
    else form.submit()
  }

  async function start() {
    setMessage("")
    doneRef.current = false
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "This browser cannot use the camera here. Open this page in Safari over https, or type the barcode in the box below."
      )
      return
    }
    setStatus("starting")
    try {
      const zxing = await loadLibrary()
      const video = videoRef.current
      if (!video) throw new Error("Camera view is missing.")
      const hints = new Map<number, unknown>([
        [HINT_POSSIBLE_FORMATS, FORMATS.map((name) => zxing.BarcodeFormat[name])],
        [HINT_TRY_HARDER, true],
      ])
      const reader = new zxing.BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 120 })
      const controls = await reader.decodeFromConstraints(
        {
          audio: false,
          // "environment" is the back camera. "ideal" lets laptops with only a front camera still work.
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        },
        video,
        (result) => {
          const text = result?.getText().trim()
          if (text) applyBarcode(text)
        }
      )
      if (doneRef.current) {
        controls.stop()
        return
      }
      controlsRef.current = controls
      setStatus("on")
    } catch (error) {
      stop()
      setStatus("off")
      setMessage(cameraMessage(error))
    }
  }

  function cancel() {
    doneRef.current = true
    stop()
    setStatus("off")
  }

  return (
    <div className="mb-4">
      {status === "off" ? (
        <button
          type="button"
          onClick={start}
          className="whitespace-nowrap rounded-md bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800"
        >
          Scan with camera
        </button>
      ) : (
        <button
          type="button"
          onClick={cancel}
          className="whitespace-nowrap rounded-md border border-neutral-400 bg-white px-4 py-3 text-base font-semibold text-black hover:bg-neutral-100"
        >
          Stop camera
        </button>
      )}

      {message ? (
        <p role="alert" className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {message}
        </p>
      ) : null}

      {/* playsInline + muted are required for the camera preview to play inside the page on iPhone. */}
      <div className={status === "off" ? "hidden" : "mt-3"}>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full max-w-md rounded-lg border border-neutral-400 bg-black"
        />
        <p className="mt-2 text-sm text-neutral-700">
          {status === "starting" ? "Starting camera..." : "Point the back camera at the barcode and hold steady."}
        </p>
      </div>
    </div>
  )
}
