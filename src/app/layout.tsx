import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GothTech | Expert Repair Services for Phones and iPads",
  description:
    "Fast, reliable Apple device repair in Minneapolis. iPhone, iPad, and Apple Watch screen repair, battery replacement, and more. Free diagnostics.",
  metadataBase: new URL("https://gothtech.repair"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GothTech | Expert Repair Services for Phones and iPads",
    description:
      "Fast, reliable Apple device repair in Minneapolis. Screen repair, battery replacement, and more. Free diagnostics.",
    url: "https://gothtech.repair",
    siteName: "GothTech",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GothTech — Expert Apple Device Repair" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GothTech | Expert Repair Services for Phones and iPads",
    description: "Fast, reliable Apple device repair in Minneapolis. Free diagnostics.",
    images: ["/og-image.png"],
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
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
