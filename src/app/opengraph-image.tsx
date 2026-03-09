import { ImageResponse } from "next/og"
import { BUSINESS } from "@/config/business"

export const runtime = "edge"
export const alt = `${BUSINESS.name} — ${BUSINESS.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://${BUSINESS.domain}/images/logo.png`}
          alt=""
          width={120}
          height={120}
          style={{ marginBottom: 32 }}
        />
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{BUSINESS.name}</div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 12, color: "#a1a1aa" }}>
          {BUSINESS.tagline}
        </div>
      </div>
    ),
    { ...size },
  )
}
