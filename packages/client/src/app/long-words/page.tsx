import React from "react"
import LongWordSearchTemplate from "../../components/templates/LongWordSearchTemplate"
import { fetchLongWords } from "@/api/actions/fetchLongWords"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: { letter?: string }
}

const Page: React.FC<Props> = async ({ searchParams }) => {
  const letter = searchParams.letter || ""

  const words = await fetchLongWords(letter, 10, 0)

  return <LongWordSearchTemplate letter={letter} initialResult={words} />
}

export const generateMetadata = async ({ searchParams }: Props) => {
  return {
    title: searchParams.letter
      ? `'${searchParams.letter}'로 시작하는 긴 단어 랭킹`
      : "키뮤사전에서 가장 긴 단어 전체 랭킹",
    description:
      "키뮤사전에서 상식을 벗어나는 긴 단어를 찾아보세요! 끝말잇기에서 쓰진 마시고요...",
  }
}

export default Page
