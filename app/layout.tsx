import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/components/app-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PalmCareConnect - Healthcare Management System",
  description: "Advanced healthcare management system with palm recognition technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap every page/component in AppProvider */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
