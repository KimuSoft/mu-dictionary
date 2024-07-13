import React, { cache } from "react"
import { notFound } from "next/navigation"
import WordDetailTemplate from "@/components/templates/WordDetailTemplate"
import { fetchHomonym } from "@/api/actions/fetchHomonym"
import { Metadata, type Viewport } from "next"
import { fetchWord } from "@/api/actions/fetchWord"
import getTagData from "@/utils/getTagData"
import theme from "@/theme/theme"

export const dynamic = "force-dynamic"

const fetchWordCache = cache(fetchWord)

interface Props {
  params: { id: string }
}

const KAKAO_APP_KEY = process.env.KAKAO_APP_KEY!

const Page: React.FC<Props> = async ({ params }) => {
  const res = await fetchWordCache(params.id)
  const word = res.data

  if (!word) return notFound()

  const homonyms = await fetchHomonym(word)

  return (
    <WordDetailTemplate
      word={word}
      homonyms={homonyms}
      kakaoMapAppKey={KAKAO_APP_KEY}
    />
  )
}

export const generateViewport = async ({
  params,
}: Props): Promise<Viewport> => {
  const res = await fetchWordCache(params.id)
  if (!res.data) return notFound()

  const { color } = getTagData(res.data.tags[0] || "")

  return { themeColor: theme.colors[color]["300"] || "#63B3ED" }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const res = await fetchWordCache(params.id)
  if (!res.data) return notFound()

  const word = res.data

  const originStr = word.name !== word.origin ? `(${word.origin}) ` : ""
  let tagStr = word.tags.length ? ` (${word.tags[0]})` : ""

  const title = word.name.replace(/[-^]/g, " ") + tagStr
  const description =
    originStr +
    (word.definition.length > 100
      ? word.definition.slice(0, 90) + "..."
      : word.definition)

  return {
    title,
    description,
    keywords: [word.name, word.simplifiedName, word.origin, ...word.tags],
    classification: "dictionary",
    openGraph: {
      title,
      type: "website",
      locale: "ko_KR",
      siteName: "키뮤사전",
      description: description,
      ...(word.thumbnail
        ? {
            images: {
              url: word.thumbnail,
              alt: word.simplifiedName,
            },
          }
        : {
            images: { url: "/thumbnail.png" },
          }),
    },
  }
}

export default Page
