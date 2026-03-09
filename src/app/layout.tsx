import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BUSINESS } from "@/config/business"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const seoTitle = `${BUSINESS.name} | ${BUSINESS.tagline} for Phones and iPads`

export const metadata: Metadata = {
  title: seoTitle,
  description: BUSINESS.seo.description,
  metadataBase: new URL(`https://${BUSINESS.domain}`),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: seoTitle,
    description: BUSINESS.seo.description,
    url: `https://${BUSINESS.domain}`,
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: BUSINESS.seo.description,
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
