import React from "react"
import SearchTemplate from "../templates/SearchTemplate"
import { useSearchParams } from "react-router-dom"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("q")

  return <SearchTemplate keyword={keyword || ""} />
}

export default Search
