import React from "react"
import styled from "styled-components"
import SearchBar from "../molecules/SearchBar"
import Header from "../molecules/Header"
import { useNavigate } from "react-router-dom"

const Main: React.FC = () => {
  const navigate = useNavigate()

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search/" + encodeURIComponent(keyword))
  }

  return (
    <MainStyle>
      <Header />
      <Body>
        <Logo>
          <Title>μDictionary</Title>
          <Slogan>우리만의 조금 특별한 한국어 사전</Slogan>
        </Logo>
        <SearchBox>
          <SearchBar onSubmit={onSearch} />
        </SearchBox>
      </Body>
    </MainStyle>
  )
}

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

  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 100px;
  gap: 50px;
`

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 700px;
  max-width: 100%;
`

const Logo = styled.div`
  margin-bottom: 10px;
  text-align: center;

  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`
const Title = styled.div`
  font-size: 64px;
  font-weight: 700;
`

const Slogan = styled.div`
  font-size: 24px;
  font-weight: 400;
`

export default Main
