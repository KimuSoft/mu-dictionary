import React from "react"
import { useNavigate } from "react-router-dom"
import { Center, Heading, Text, VStack } from "@chakra-ui/react"
import SearchInput from "../organisms/SearchInput"
import Header from "../organisms/Header"

const MainTemplate: React.FC = () => {
  const navigate = useNavigate()

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search?q=" + encodeURIComponent(keyword))
  }

  return (
    <VStack w={"100vw"} h={"100vh"}>
      <Header />
      <Center h={"100%"} flexDir={"column"} gap={3}>
        <VStack gap={3} mb={5} userSelect={"none"}>
          <Heading size={"3xl"}>μDictionary</Heading>
          <Text size={"xs"} letterSpacing={8}>
            우리만의 조금 특별한 한국어 사전
          </Text>
        </VStack>
        <SearchInput
          w={"600px"}
          placeholder={"단어 무더기에서 원하는 거 찾기"}
          onSubmit={onSearch}
        />
      </Center>
    </VStack>
  )
}

export default MainTemplate
