import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"
import { PublicOnly } from "@/components/layout/public-only"
import { ConsentManager } from "@/components/consent/consent-manager"
import { HalloweenPopup } from "@/components/halloween/halloween-popup"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GothTech | Phone Repair Minneapolis & iPad Repair Minneapolis",
  description:
    "Certified technicians with over 10,000 screen repairs completed. Phone repair Minneapolis, iPad repair Minneapolis — same-day service, free diagnostics. Mail-in repairs available nationwide.",
  metadataBase: new URL("https://gothtech.repair"),
  alternates: { canonical: "/" },
  // Black G in a white circle. Files live in /public; the Android
  // home-screen icons are listed in src/app/manifest.ts.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "GothTech | Phone Repair Minneapolis & iPad Repair Minneapolis",
    description:
      "Certified technicians with over 50,000 screen repairs completed. Phone repair Minneapolis, iPad repair Minneapolis — same-day service, free diagnostics.",
    url: "https://gothtech.repair",
    siteName: "GothTech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GothTech | Phone Repair Minneapolis & iPad Repair Minneapolis",
    description: "Certified technicians with over 10,000 screen repairs completed. Phone and iPad repair in Minneapolis. Free diagnostics.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PublicOnly>
          <Header />
        </PublicOnly>
        <main>{children}</main>
        <PublicOnly>
          <Footer />
          {/* Cookie banner. Google Analytics, Google Ads, Meta Pixel and
              Vercel Analytics are loaded from inside it, only after the
              visitor's cookie choice allows them. */}
          <ConsentManager />
          {/* Halloween 2026 offer popup (switches itself off after Oct 31). */}
          <HalloweenPopup />
        </PublicOnly>
      </body>
    </html>
  )
}
