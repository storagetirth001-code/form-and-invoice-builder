import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Form & Invoice Builder | Create Professional Documents",
  description: "Create beautiful forms, invoices, and resumes with drag-and-drop simplicity. Professional templates, real-time preview, and easy export.",
  keywords: ["form builder", "invoice generator", "resume builder", "no-code", "drag and drop"],
  authors: [{ name: "Form & Invoice Builder Team" }],
  openGraph: {
    title: "Form & Invoice Builder",
    description: "The all-in-one tool for professional documents",
    url: "https://form-invoice-builder.vercel.app",
    siteName: "Form & Invoice Builder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Form & Invoice Builder",
    description: "Create professional documents in seconds",
  },
  generator: "next.js",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
