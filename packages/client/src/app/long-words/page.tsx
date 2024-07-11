import React, { useEffect } from "react"
import LongWordSearchTemplate from "../../components/templates/LongWordSearchTemplate"
import { api } from "@/api/api"
import { fetchLongWords, LongWordItem } from "@/api/actions/fetchLongWords"

const Page: React.FC<{ searchParams: { letter?: string } }> = async ({
  searchParams,
}) => {
  const letter = searchParams.letter || ""

  const words = await fetchLongWords(letter, 10, 0)

  return <LongWordSearchTemplate letter={letter} initialResult={words} />
}

export default Page
