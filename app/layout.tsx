import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "DentalERP - Open Source Dental Hospital Management Software Pakistan",
    template: "%s | DentalERP",
  },
  description:
    "Free open-source dental clinic management software for Pakistan. Patient records, appointment scheduling, GST billing, inventory, AI-powered treatment planning, insurance claims, tele-dentistry. Built for Pakistann dental hospitals and clinics.",
  keywords: [
    "dental software Pakistan",
    "dental clinic management software",
    "dental hospital management system",
    "dental ERP",
    "dental practice management",
    "open source dental software",
    "free dental software Pakistan",
    "dental billing software GST",
    "patient management system dental",
    "appointment scheduling dental",
    "dental clinic software free",
    "hospital management system Pakistan",
    "HMS Pakistan",
    "dental records software",
    "AI dental software",
    "tele-dentistry Pakistan",
    "dental inventory management",
    "dental insurance claims Pakistan",
    "dental lab management",
    "multi-branch dental software",
  ],
  authors: [{ name: "Abinauv Selvaraj" }],
  creator: "Abinauv Selvaraj",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "DentalERP - Open Source Dental Hospital Management Software",
    description:
      "Free, AI-powered dental clinic management system built for Pakistann dental hospitals. Patient records, GST billing, appointments, inventory, insurance, tele-dentistry and more.",
    siteName: "DentalERP",
  },
  twitter: {
    card: "summary_large_image",
    title: "DentalERP - Open Source Dental Hospital Management Software",
    description:
      "Free, AI-powered dental clinic management system for Pakistan. 16 AI skills, GST billing, patient portal, tele-dentistry.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DentalERP",
  },
}

export const viewport: Viewport = {
  themeColor: "#0891B2",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
