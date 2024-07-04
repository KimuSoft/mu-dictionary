import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Center,
  Container,
  Heading,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import SearchInput from "../organisms/SearchInput"
import Header from "../organisms/Header"

const MainTemplate: React.FC = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const navigate = useNavigate()

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search?q=" + encodeURIComponent(keyword))
  }

  return (
    <VStack w={"100vw"} h={"100vh"} px={3} overflow={"hidden"}>
      <Header />
      <Container h={"100%"} maxW={"3xl"}>
        <Center h={"100%"} flexDir={"column"} gap={3}>
          <VStack gap={3} mb={5} userSelect={"none"}>
            <Heading size={"3xl"}>μDictionary</Heading>
            <Text size={"xs"} letterSpacing={isMobile ? 2 : 8}>
              우리만의 조금 특별한 한국어 사전
            </Text>
          </VStack>
          <SearchInput
            w={"100%"}
            placeholder={"단어 무더기에서 원하는 거 찾기"}
            onSubmit={onSearch}
          />
        </Center>
      </Container>
    </VStack>
  )
}

export default MainTemplate
