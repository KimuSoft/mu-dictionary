import React, { useEffect, useMemo } from "react"
import SearchTemplate from "../templates/SearchTemplate"
import { useSearchParams } from "react-router-dom"
import { searchWords } from "../../api/word"
import { Word } from "mudict-api-types"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  const tagsFilterQuery = searchParams.get("tags")?.split(",") || []

  const [searchResults, setSearchResults] = React.useState<Word[]>([])
  const [totalCount, setTotalCount] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(false)

  const allLoaded = useMemo(
    () => searchResults.length >= totalCount,
    [searchResults, totalCount],
  )

  const refresh = async () => {
    setIsLoading(true)
    const words = await searchWords(searchQuery, tagsFilterQuery, 50, 0)
    console.log(words)
    setTotalCount(words.estimatedTotalHits)
    setSearchResults(words.hits)
    setIsLoading(false)
  }

  const loadMore = async () => {
    if (allLoaded || isLoading) return
    setIsLoading(true)
    const words = await searchWords(
      searchQuery,
      tagsFilterQuery,
      50,
      searchResults.length,
    )
    setSearchResults([...searchResults, ...words.hits])
    setIsLoading(false)
  }

  useEffect(() => {
    setSearchResults([])
    refresh().then()
  }, [searchQuery])

  return (
    <SearchTemplate
      keyword={searchQuery}
      searchResults={searchResults}
      onEndReached={loadMore}
      isLoading={isLoading}
      totalCount={totalCount}
      allLoaded={allLoaded}
    />
  )
}

export default Search
