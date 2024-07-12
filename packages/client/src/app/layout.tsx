import type { Metadata, Viewport } from "next"
import "./globals.css"
import React from "react"
import Providers from "@/app/providers"
import { headers } from "next/headers"

export const metadata: Metadata = {
  generator: "Next.js",
  applicationName: "키뮤사전",
  keywords: ["키뮤사전", "사전", "dictionary", "mudict", "mudictionary"],
  creator: "키뮤 (Kimu)",
  publisher: "키뮤스토리 (KIMUSTORY)",
  title: {
    default: "키뮤사전 — 우리만의 조금 특별한 한국어 사전",
    template: "%s | 키뮤사전",
  },
  description:
    "세상의 모든 단어를 모으는 특별한 한국어 사전, 현재 약 200만개의 표제어가 등록되어 있습니다.",
  metadataBase: new URL("https://dict.kimustory.net"),
  category: "dictionary",
  classification: "dictionary",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "키뮤사전",
    images: {
      url: "/thumbnail.png",
      width: 627,
      height: 228,
    },
  },
}

export const generateViewport = (): Viewport => {
  return { themeColor: "#63B3ED" }
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
