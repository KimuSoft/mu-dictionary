import React from "react"
import { searchWords } from "@/api/actions/searchWords"
import SearchTemplate from "@/components/templates/SearchTemplate"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: {
    q?: string
    tags?: string
  }
}

const Page: React.FC<Props> = async ({ searchParams }) => {
  const searchQuery = searchParams.q || ""
  const tagsFilterQuery = searchParams.tags?.split(",") || []

  const { hits, estimatedTotalHits } = await searchWords(
    searchQuery,
    tagsFilterQuery,
    50,
    0,
  )

  return (
    <SearchTemplate
      tagFilter={tagsFilterQuery}
      keyword={searchQuery}
      initialResult={hits}
      totalCount={estimatedTotalHits}
    />
  )
}

export const generateMetadata = async ({ searchParams }: Props) => {
  return {
    title: `'${searchParams.q}' 검색 결과 : 키뮤사전`,
    description: "우리만의 조금 특별한 한국어 사전, 키뮤사전",
    classification: "search",
  }
}

export default Page
