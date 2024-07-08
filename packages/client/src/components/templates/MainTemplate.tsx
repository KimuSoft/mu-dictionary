import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Center,
  Container,
  Divider,
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
  const scrollRef = useRef(null)

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search?q=" + encodeURIComponent(keyword))
  }

  return (
    <VStack ref={scrollRef} w={"100vw"}>
      <Header />
      <VStack w={"100%"} h={"100vh"} px={3} overflow={"hidden"}>
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
          </Center>
        </Container>
      </VStack>
      <Center
        // bgColor={useColorModeValue("gray.200", "gray.900")}
        w={"100%"}
        minH={"100vh"}
        py={10}
      >
        <Container h={"100%"} maxW={"3xl"}>
          {tagStats.length ? (
            <Center
              as={motion.div}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ root: scrollRef }}
              flexDir={"column"}
              w={"100%"}
              h={"100%"}
              gap={3}
            >
              <Heading fontSize={"lg"}>키뮤사전 수록 주제</Heading>
              <Divider />
              <Center gap={2} flexWrap={"wrap"} maxW={"100%"}>
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
                        onClick={() =>
                          navigate(
                            "/search?tags=" + encodeURIComponent(tag.tag),
                          )
                        }
                        tag={tag.tag}
                      />
                    </Tooltip>
                  )
                })}
              </Center>
            </Center>
          ) : null}
        </Container>
      </Center>
    </VStack>
  )
}

export default MainTemplate
