import type { Metadata } from "next"
import "./globals.css"
import React from "react"
import Providers from "@/app/providers"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "키뮤사전 — 우리만의 조금 특별한 한국어 사전",
  description: "우리만의 조금 특별한 한국어 사전",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const header = headers()
  const cookie = header.get("cookie") || ""
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Providers cookies={cookie}>{children}</Providers>
      </body>
    </html>
  )
}
