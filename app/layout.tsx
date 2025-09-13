import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MediVision Assistant - AI-Powered Healthcare Companion",
  description: "Accessible multimodal health monitoring for elderly and disabled users",
  generator: "v0.app",
  keywords: ["healthcare", "accessibility", "AI", "health monitoring", "elderly care"],
  authors: [{ name: "MediVision Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        <AccessibilityProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div id="skip-link" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50">
              <a href="#main-content" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Skip to main content
              </a>
            </div>
            <AccessibilityToolbar />
            <main id="main-content">{children}</main>
          </Suspense>
          <Analytics />
        </AccessibilityProvider>
      </body>
    </html>
  )
}
