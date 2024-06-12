import React, { useEffect } from "react"
import SearchTemplate from "../templates/SearchTemplate"
import { useSearchParams } from "react-router-dom"
import { Homonym, IWord } from "../../types/types"
import axios from "axios"
import _ from "lodash"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = React.useState<Homonym[]>([])

  const refresh = async () => {
    const res = (await axios.get("/api/search", {
      params: { q: searchQuery },
    })) as { data: IWord[] }

    console.log(res)

    const _homonyms = _.groupBy(res.data, (h) => `${h.name}-${h.origin}`)
    const homonyms: Homonym[] = []

    console.log(_homonyms)

    let cursorWord = ""
    let cursorNo = 1
    for (const key of Object.keys(_homonyms)) {
      let words = _homonyms[key]
      const word = words[0]

      if (cursorWord !== word.name) {
        cursorWord = word.name
        cursorNo = 1
      }

      words = words.map((w, i) => ({
        ...w,
        number: cursorNo + i,
      }))

      homonyms.push({
        words: words,
        origin: word.origin,
        name: word.name,
        pronunciation: word.pronunciation,
      })

      cursorNo += words.length
    }

    setSearchResults(homonyms)
  }

  useEffect(() => {
    refresh().then()
  }, [searchQuery])

  return <SearchTemplate keyword={searchQuery} searchResults={searchResults} />
}

export default Search
