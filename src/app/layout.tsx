import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"
import DiscountModal from "@/components/discount-modal"
import { PublicOnly } from "@/components/layout/public-only"
import { ConsentManager } from "@/components/consent/consent-manager"


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
          <DiscountModal />
          {/* Cookie banner. Google Analytics, Google Ads, Meta Pixel and
              Vercel Analytics are loaded from inside it, only after the
              visitor's cookie choice allows them. */}
          <ConsentManager />
        </PublicOnly>
      </body>
    </html>
  )
}
