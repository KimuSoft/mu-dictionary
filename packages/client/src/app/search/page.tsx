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
  const tagsFilterQuery = searchParams.tags?.split(",")
  const tagFilterStr = tagsFilterQuery
    ? tagsFilterQuery.join(", ") + " 주제 "
    : ""

  const queryStr = searchParams.q ? `'${searchParams.q}' ` : "전체 "

  return {
    title: `${tagFilterStr}${queryStr}검색 결과`,
    description: `${tagFilterStr}${queryStr} 키뮤사전 검색 결과입니다.`,
    classification: "search",
  }
}

export default Page
