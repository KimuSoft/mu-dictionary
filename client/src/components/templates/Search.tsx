import React from "react"
import styled from "styled-components"
import SearchBar from "../molecules/SearchBar"
import Header from "../molecules/Header"
import Word from "../organisms/Word"
import { useParams } from "react-router-dom"
import { WordClass } from "../../types"

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
  padding-bottom: 100px;
  gap: 50px;
`

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;
  gap: 25px;
`

const MiniLogo = styled.div`
  font-weight: 700;
  font-size: 64px;
  line-height: 77px;

  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`

const Results = styled.div`
  width: 900px;
  height: 100%;
`

const SearchPage: React.FC = () => {
  const params = useParams<"keyword">()

  return (
    <MainStyle>
      <Header />
      <Body>
        <Top>
          <MiniLogo>μDic</MiniLogo>
          <SearchBar />
        </Top>
        <Results>
          <Word
            homonym={{
              name: params.keyword || "구이",
              words: [
                {
                  name: "키뮤",
                  definition:
                    "Google의 무료 서비스로 영어와 100개 이상의 다른 언어로 단어, 구문, 웹페이지를 즉시 번역합니다.",
                  tags: [],
                  wordClass: WordClass.Noun,
                },
              ],
            }}
          />
          <Word
            homonym={{
              name: "키뮤",
              words: [
                {
                  name: "키뮤",
                  definition:
                    "기계 번역은 인간이 사용하는 자연 언어를 컴퓨터를 사용하여 다른 언어로 번역하는 일을 말한다.",
                  tags: [],
                  wordClass: WordClass.Noun,
                },
              ],
            }}
          />
        </Results>
      </Body>
    </MainStyle>
  )
}

export default SearchPage
