"use client"

import { useEffect, useRef, useState } from "react"

// The barcode reader is zxing-wasm (the C++ ZXing reader compiled to WebAssembly).
// Its two files live in public/vendor and are only downloaded when the camera is used.
type ReadResult = { isValid: boolean; text: string; format: string }
type ZXingWasm = {
  prepareZXingModule: (options: {
    overrides: { locateFile: (path: string, prefix: string) => string }
    fireImmediately: boolean
  }) => Promise<unknown>
  readBarcodes: (image: ImageData, options: Record<string, unknown>) => Promise<ReadResult[]>
}

const LIBRARY_URL = "/vendor/zxing-wasm-reader.js"
const WASM_URL = "/vendor/zxing_reader.wasm"

// Exactly the barcode types Evertrail needs: product barcodes and Evertrail's own labels.
const READER_OPTIONS = {
  formats: ["UPCA", "UPCE", "EAN13", "EAN8", "Code128"],
  tryHarder: true,
  tryRotate: true,
  tryInvert: false,
  tryDownscale: true,
  maxNumberOfSymbols: 1,
}

// How often a video frame is checked for a barcode (milliseconds).
const SCAN_EVERY_MS = 120
// The guide box, as fractions of the camera view (left, top, width, height).
const GUIDE = { x: 0.06, y: 0.28, w: 0.88, h: 0.44 }
const MESSAGE_HOLD = "Hold the barcode steady, 6 to 8 inches away."

/**
 * The reader reports a US product barcode (UPC-A, 12 digits) as its 13-digit EAN form with a 0 in front.
 * A handheld scanner sends the 12 digits printed under the bars, so do the same here.
 */
function cleanBarcode(result: ReadResult): string {
  const text = result.text.trim()
  if (/^0\d{12}$/.test(text)) return text.slice(1)
  return text
}

let libraryPromise: Promise<ZXingWasm> | null = null

/** Downloads the barcode reader the first time the camera is used. */
function loadLibrary(): Promise<ZXingWasm> {
  if (!libraryPromise) {
    libraryPromise = new Promise<ZXingWasm>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = LIBRARY_URL
      script.async = true
      script.onload = () => {
        const loaded = (window as unknown as { ZXingWASM?: ZXingWasm }).ZXingWASM
        if (!loaded) {
          reject(new Error("Barcode reader did not load."))
          return
        }
        // Tell it to fetch the .wasm file from this site, then start it up now.
        loaded
          .prepareZXingModule({ overrides: { locateFile: () => WASM_URL }, fireImmediately: true })
          .then(() => resolve(loaded), reject)
      }
      script.onerror = () => reject(new Error("Barcode reader could not be downloaded."))
      document.head.appendChild(script)
    })
    // If it failed, let the next press try again from scratch.
    libraryPromise.catch(() => {
      libraryPromise = null
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
 * Asks the camera for continuous autofocus and a little zoom, where the phone supports it.
 * Zoom lets you hold the phone 6 to 8 inches away (where it can focus) and still see a small barcode large.
 * Phones that do not support these settings simply ignore them.
 */
async function tuneCamera(track: MediaStreamTrack) {
  try {
    const caps = (track.getCapabilities?.() ?? {}) as {
      focusMode?: string[]
      zoom?: { min: number; max: number }
    }
    const advanced: Record<string, unknown>[] = []
    if (caps.focusMode?.includes("continuous")) advanced.push({ focusMode: "continuous" })
    if (caps.zoom && caps.zoom.max >= 2) advanced.push({ zoom: Math.max(caps.zoom.min, 2) })
    for (const setting of advanced) {
      await track.applyConstraints({ advanced: [setting as MediaTrackConstraintSet] }).catch(() => {})
    }
  } catch {
    // Not supported on this phone: carry on with the camera's own autofocus.
  }
}

/**
 * "Scan with camera" for the Scan page.
 * When it reads a barcode it types it into the existing box (the input named
 * `inputName` inside the form with id `formId`) and submits that form,
 * exactly like pressing "Look up".
 */
export function CameraScanner({ formId, inputName }: { formId: string; inputName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLSpanElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Goes up every time the camera is started or stopped, so an old run can tell it is no longer wanted.
  const runRef = useRef(0)
  const [status, setStatus] = useState<"off" | "starting" | "on" | "found">("off")
  const [message, setMessage] = useState("")
  const [found, setFound] = useState("")

  function stop() {
    runRef.current += 1
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }

  // Turn the camera off if the person leaves the page.
  useEffect(() => stop, [])

  /** Fills the existing box and runs the same lookup as pressing "Look up". */
  function lookUp(text: string) {
    const form = document.getElementById(formId) as HTMLFormElement | null
    const input = form?.elements.namedItem(inputName)
    if (!form || !(input instanceof HTMLInputElement)) {
      setStatus("off")
      setMessage(`Read ${text}, but could not find the barcode box. Type it in below.`)
      return
    }
    input.value = text
    if (typeof form.requestSubmit === "function") form.requestSubmit()
    else form.submit()
  }

  /**
   * Works out which part of the camera picture to check.
   * The picture is shown cropped to fill the view ("cover"), so this converts
   * a rectangle of the view (fractions 0..1) into pixels of the real video frame.
   */
  function videoRect(video: HTMLVideoElement, fx: number, fy: number, fw: number, fh: number) {
    const view = viewRef.current
    const vw = video.videoWidth
    const vh = video.videoHeight
    const W = view?.clientWidth || vw
    const H = view?.clientHeight || vh
    const scale = Math.max(W / vw, H / vh)
    const visibleW = W / scale
    const visibleH = H / scale
    const left = (vw - visibleW) / 2
    const top = (vh - visibleH) / 2
    return {
      sx: Math.round(left + fx * visibleW),
      sy: Math.round(top + fy * visibleH),
      sw: Math.round(fw * visibleW),
      sh: Math.round(fh * visibleH),
    }
  }

  async function start() {
    stop()
    const run = runRef.current
    setMessage("")
    setFound("")
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "This browser cannot use the camera here. Open this page in Safari over https, or type the barcode in the box below."
      )
      return
    }
    setStatus("starting")
    try {
      // 1. Back camera, high resolution so small barcodes have enough detail.
      //    (This is at least 1280x720 on any phone made in the last several years.)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        // "environment" is the back camera. Ask for the sharpest picture the phone offers (4K if it has it,
        // otherwise the phone gives the closest it can, normally 1920x1080).
        video: { facingMode: { ideal: "environment" }, width: { ideal: 3840 }, height: { ideal: 2160 } },
      })
      if (run !== runRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      const track = stream.getVideoTracks()[0]
      await tuneCamera(track)
      const cameraName = track.label || "Camera"

      const video = videoRef.current
      if (!video) throw new Error("Camera view is missing.")
      video.srcObject = stream
      await video.play().catch(() => {})

      // 2. The barcode reader.
      const zxing = await loadLibrary()
      if (run !== runRef.current) return
      setStatus("on")

      // 3. Check frames over and over until a barcode is read or the camera is stopped.
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d", { willReadFrequently: true })
      if (!context) throw new Error("This browser cannot read camera frames.")
      let frames = 0

      const tick = async () => {
        if (run !== runRef.current) return
        try {
          if (video.readyState >= 2 && video.videoWidth > 0) {
            frames += 1
            // Three kinds of check take turns, because each one catches barcodes the others miss:
            //   1. the area around the guide box, at the camera's full sharpness
            //   2. just the guide box, enlarged 2x (helps small or slightly soft barcodes)
            //   3. the whole camera view (in case the barcode is not lined up with the box)
            const mode = frames % 3
            let rect = videoRect(video, 0, GUIDE.y - 0.1, 1, GUIDE.h + 0.2)
            let enlarge = 1
            if (mode === 1) {
              rect = videoRect(video, GUIDE.x - 0.04, GUIDE.y - 0.04, GUIDE.w + 0.08, GUIDE.h + 0.08)
              enlarge = 2
            } else if (mode === 2) {
              rect = videoRect(video, 0, 0, 1, 1)
            }
            // Keep each check a sensible size so it stays fast.
            const size = Math.min(enlarge, 2200 / rect.sw)
            canvas.width = Math.max(1, Math.round(rect.sw * size))
            canvas.height = Math.max(1, Math.round(rect.sh * size))
            context.imageSmoothingQuality = "high"
            context.drawImage(video, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, canvas.width, canvas.height)
            const image = context.getImageData(0, 0, canvas.width, canvas.height)
            const results = await zxing.readBarcodes(image, READER_OPTIONS)
            if (run !== runRef.current) return
            const hit = results.find((r) => r.isValid && r.text.trim())
            if (hit) {
              const text = cleanBarcode(hit)
              stop()
              // Short confirmation: buzz (Android; iPhones do not support it) and a green message.
              try {
                navigator.vibrate?.(80)
              } catch {
                // no vibration on this device
              }
              setFound(text)
              setStatus("found")
              setTimeout(() => lookUp(text), 600)
              return
            }
            if (infoRef.current) {
              infoRef.current.textContent = `${cameraName} ${video.videoWidth}x${video.videoHeight} - checked ${frames} frames`
            }
          }
        } catch (error) {
          if (infoRef.current) {
            infoRef.current.textContent =
              "Reader error: " + (error instanceof Error ? error.message : String(error))
          }
        }
        timerRef.current = setTimeout(tick, SCAN_EVERY_MS)
      }
      tick()
    } catch (error) {
      if (run !== runRef.current) return
      stop()
      setStatus("off")
      setMessage(cameraMessage(error))
    }
  }

  function cancel() {
    stop()
    setStatus("off")
  }

  const cameraOpen = status === "starting" || status === "on"

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {cameraOpen ? (
          <>
            <button
              type="button"
              onClick={start}
              className="whitespace-nowrap rounded-md bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800"
            >
              Retry (refocus)
            </button>
            <button
              type="button"
              onClick={cancel}
              className="whitespace-nowrap rounded-md border border-neutral-400 bg-white px-4 py-3 text-base font-semibold text-black hover:bg-neutral-100"
            >
              Stop camera
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={status === "found"}
            className="whitespace-nowrap rounded-md bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            Scan with camera
          </button>
        )}
      </div>

      {message ? (
        <p role="alert" className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {message}
        </p>
      ) : null}

      {status === "found" ? (
        <p
          role="status"
          className="mt-3 rounded-md border border-green-400 bg-green-50 px-3 py-3 text-base font-semibold text-green-900"
        >
          Barcode read: <span className="font-mono">{found}</span> - looking it up...
        </p>
      ) : null}

      <div className={cameraOpen ? "mt-3" : "hidden"}>
        {/* The camera view. The video fills it; the white box shows where to hold the barcode. */}
        <div
          ref={viewRef}
          className="relative w-full max-w-md overflow-hidden rounded-lg border border-neutral-400 bg-black"
          style={{ aspectRatio: "4 / 3" }}
        >
          {/* playsInline + muted are required for the preview to play inside the page on iPhone. */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: "cover" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-md"
            style={{
              left: `${GUIDE.x * 100}%`,
              top: `${GUIDE.y * 100}%`,
              width: `${GUIDE.w * 100}%`,
              height: `${GUIDE.h * 100}%`,
              border: "3px solid #fff",
              boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.35)",
            }}
          />
        </div>
        <p className="mt-2 text-base font-semibold text-black">
          {status === "starting" ? "Starting camera..." : MESSAGE_HOLD}
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          Put the barcode inside the white box. If it looks blurry, move back a little and press Retry (refocus).
          <br />
          <span ref={infoRef} />
        </p>
      </div>
    </div>
  )
}
