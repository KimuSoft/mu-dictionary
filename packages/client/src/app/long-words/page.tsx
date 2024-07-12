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
    title: `'${searchParams.letter}'로 시작하는 긴 단어 랭킹`,
    description: "키뮤사전의 단어는 항상 당신의 상식을 벗어난답니다.",
  }
}

export default Page
