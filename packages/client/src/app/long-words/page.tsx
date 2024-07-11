import React from "react"
import LongWordSearchTemplate from "../../components/templates/LongWordSearchTemplate"
import { fetchLongWords } from "@/api/actions/fetchLongWords"

export const dynamic = "force-dynamic"

const Page: React.FC<{ searchParams: { letter?: string } }> = async ({
  searchParams,
}) => {
  const letter = searchParams.letter || ""

  const words = await fetchLongWords(letter, 10, 0)

  return <LongWordSearchTemplate letter={letter} initialResult={words} />
}

export default Page
