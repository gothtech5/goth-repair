import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"
import DiscountModal from "@/components/discount-modal"


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
      <head>
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '511183678414751');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Google Ads Pixel */}
        <Script
          id="google-ads-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=AW-5933503394`}
        />
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-5933503394');
            `,
          }}
        />
        {/* Google Analytics */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-50CTNL3LTG"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-50CTNL3LTG');
  `}
</Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=511183678414751&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
          <DiscountModal />

        <Analytics />
      </body>
    </html>
  )
}
