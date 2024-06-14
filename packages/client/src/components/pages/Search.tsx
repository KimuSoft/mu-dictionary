import React, { useEffect } from "react"
import SearchTemplate from "../templates/SearchTemplate"
import { useSearchParams } from "react-router-dom"
import { IWord } from "../../types/types"
import { searchWords } from "../../api/word"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = React.useState<IWord[]>([])

  const refresh = async () => {
    console.log("리프레시!!!")
    const words = await searchWords(searchQuery, 1000, 0)
    console.log(words)
    setSearchResults(words.hits)

    // const _homonyms = _.groupBy(res.data, (h) => `${h.name}-${h.origin}`)
    // const homonyms: Homonym[] = []
    //
    // console.log(_homonyms)
    //
    // let cursorWord = ""
    // let cursorNo = 1
    // for (const key of Object.keys(_homonyms)) {
    //   let words = _homonyms[key]
    //   const word = words[0]
    //
    //   if (cursorWord !== word.name) {
    //     cursorWord = word.name
    //     cursorNo = 1
    //   }
    //
    //   words = words.map((w, i) => ({
    //     ...w,
    //     number: cursorNo + i,
    //   }))
    //
    //   homonyms.push({
    //     words: words,
    //     origin: word.origin,
    //     name: word.name,
    //     pronunciation: word.pronunciation,
    //   })
    //
    //   cursorNo += words.length
    // }
    //
    // setSearchResults(homonyms)
  }

  useEffect(() => {
    refresh().then()
  }, [searchQuery])

  return (
    <SearchTemplate
      keyword={searchQuery}
      searchResults={searchResults}
      onEndReached={refresh}
    />
  )
}

export default Search
