import React from "react"
import styled from "styled-components"
import SearchBar from "../molecules/SearchBar"
import Header from "../molecules/Header"

const Main: React.FC = () => {
  return (
    <MainStyle>
      <Header />
      <Body>
        <Logo>
          <Title>μDictionary</Title>
          <Slogan>우리만의 조금 특별한 한국어 사전</Slogan>
        </Logo>
        <SearchBar />
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

  padding-bottom: 100px;
  gap: 50px;
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
