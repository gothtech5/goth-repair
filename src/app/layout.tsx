import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GothTech | Phone Repair Minneapolis & iPad Repair Minneapolis",
  description:
    "Certified technicians with over 10,000 screen repairs completed. Phone repair Minneapolis, iPad repair Minneapolis — same-day service, free diagnostics. Mail-in repairs available nationwide.",
  metadataBase: new URL("https://gothtech.repair"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GothTech | Phone Repair Minneapolis & iPad Repair Minneapolis",
    description:
      "Certified technicians with over 10,000 screen repairs completed. Phone repair Minneapolis, iPad repair Minneapolis — same-day service, free diagnostics.",
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
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
