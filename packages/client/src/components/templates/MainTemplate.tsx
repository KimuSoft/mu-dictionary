import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Center,
  Container,
  Heading,
  Text,
  Tooltip,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import SearchInput from "../organisms/SearchInput"
import Header from "../organisms/Header"
import { TagStatItem } from "../pages/Main"
import ThemeTag from "../atoms/ThemeTag"
import { motion } from "framer-motion"

const MainTemplate: React.FC<{ tagStats: TagStatItem[] }> = ({ tagStats }) => {
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
          <VStack w={"100%"} as={motion.div} layout>
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
          </VStack>
          {tagStats.length ? (
            <Center
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              layout
              gap={1.5}
              mt={5}
              flexWrap={"wrap"}
              maxW={"100%"}
            >
              {tagStats.map((tag) => {
                return (
                  <Tooltip
                    key={tag.tag}
                    hasArrow
                    label={`${tag.count.toLocaleString()}개의 단어`}
                  >
                    <ThemeTag
                      userSelect={"none"}
                      cursor={"pointer"}
                      onClick={() => navigate("/search?tags=" + tag.tag)}
                      tag={tag.tag}
                    />
                  </Tooltip>
                )
              })}
            </Center>
          ) : null}
        </Center>
      </Container>
    </VStack>
  )
}

export default MainTemplate
