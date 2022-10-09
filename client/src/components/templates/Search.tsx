import React, { useEffect } from "react"
import styled from "styled-components"
import SearchBar from "../molecules/SearchBar"
import Header from "../molecules/Header"
import { useNavigate, useParams } from "react-router-dom"
import { Homonym, IWord, WordClass } from "../../types"
import axios from "axios"
import _ from "lodash"
import Word from "../organisms/Word"

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 80vh;

  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 100px;
  gap: 50px;
`

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  @media (max-width: 800px) {
    flex-direction: column;
  }

  width: 900px;
  max-width: 100%;
  gap: 25px;
`

const MiniLogo = styled.div`
  font-weight: 700;
  font-size: 64px;
  line-height: 77px;

  cursor: pointer;

  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  transition: 0.2s ease-in;

  &:hover {
    color: rgba(147, 197, 253, 0.4);
    font-weight: 500;
  }
`

const Results = styled.div`
  width: 900px;
  height: 100%;
  overflow: scroll;

  max-width: 100%;
`

const SearchPage: React.FC = () => {
  const params = useParams<"keyword">()
  const navigate = useNavigate()

  const [keyword, setKeyword] = React.useState(params.keyword)
  const [wordData, setWordData] = React.useState<Homonym[]>([])

  const onSearch = async (newKeyword: string) => {
    if (!newKeyword || newKeyword === keyword) return
    setKeyword(newKeyword)
    navigate("/search/" + newKeyword)
  }

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

  const onLogoClick = () => {
    navigate("/")
  }

  return (
    <MainStyle>
      <Header />
      <Body>
        <Top>
          <MiniLogo onClick={onLogoClick}>μDic</MiniLogo>
          <SearchBar defaultValue={params.keyword} onSubmit={onSearch} />
        </Top>
        <Results>
          {wordData.map((homonym, i) => (
            <Word key={i} homonym={homonym} />
          ))}
        </Results>
      </Body>
    </MainStyle>
  )
}

export default SearchPage
