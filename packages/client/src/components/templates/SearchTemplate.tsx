import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Homonym, IWord } from "../../types/types"
import axios from "axios"
import _ from "lodash"
import Word from "../organisms/Word"
import { VStack } from "@chakra-ui/react"
import Header from "../organisms/Header"

const SearchTemplate: React.FC<{ keyword: string }> = ({ keyword }) => {
  const navigate = useNavigate()

  const [wordData, setWordData] = React.useState<Homonym[]>([])

  const refresh = async () => {
    const res = (await axios.post("/api/search", {
      keyword,
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

    setWordData(homonyms)
  }

  useEffect(() => {
    refresh().then()
  }, [keyword])

  return (
    <VStack>
      <Header showSearch={true} showLogo={true} />
      <VStack>
        {wordData.map((homonym, i) => (
          <Word key={i} homonym={homonym} />
        ))}
      </VStack>
    </VStack>
  )
}

export default SearchTemplate
