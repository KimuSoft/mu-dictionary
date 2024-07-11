import React from "react"
import { Word } from "mudict-api-types"
import { notFound } from "next/navigation"
import WordDetailTemplate from "@/components/templates/WordDetailTemplate"
import { api } from "@/api/api"
import { fetchHomonym } from "@/api/actions/fetchHomonym"

const Page: React.FC<{ params: { id: string } }> = async ({ params }) => {
  const res = await api.get<Word | null>(`/words/${params.id}`)
  const word = res.data

  if (!word) return notFound()

  const homonyms = await fetchHomonym(word)

  return <WordDetailTemplate word={word} homonyms={homonyms} />
}

export default Page
