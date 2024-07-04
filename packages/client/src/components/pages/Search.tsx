import React, { useEffect, useMemo } from "react"
import SearchTemplate from "../templates/SearchTemplate"
import { useSearchParams } from "react-router-dom"
import { IWord } from "../../types/types"
import { searchWords } from "../../api/word"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = React.useState<IWord[]>([])
  const [totalCount, setTotalCount] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(false)

  const allLoaded = useMemo(
    () => searchResults.length >= totalCount,
    [searchResults, totalCount],
  )

  const refresh = async () => {
    setIsLoading(true)
    const words = await searchWords(searchQuery, 50, 0)
    console.log(words)
    setTotalCount(words.estimatedTotalHits)
    setSearchResults(words.hits)
    setIsLoading(false)
  }

  const loadMore = async () => {
    if (allLoaded || isLoading) return
    setIsLoading(true)
    const words = await searchWords(searchQuery, 50, searchResults.length)
    setSearchResults([...searchResults, ...words.hits])
    setIsLoading(false)
  }

  useEffect(() => {
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
