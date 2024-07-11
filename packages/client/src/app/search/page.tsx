import React, { useEffect } from "react"
import { searchWords } from "@/api/actions/searchWords"
import SearchTemplate from "@/components/templates/SearchTemplate"

const Page: React.FC<{ searchParams: { q?: string; tags?: string } }> = async ({
  searchParams,
}) => {
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

export default Page
