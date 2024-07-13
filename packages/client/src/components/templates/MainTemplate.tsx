"use client"

import React, { useRef } from "react"
import {
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Text,
  Tooltip,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import SearchInput from "../organisms/SearchInput"
import Header from "../organisms/Header"
import ThemeTag from "../atoms/ThemeTag"
import { motion } from "framer-motion"
import { useRouter } from "next-nprogress-bar"
import { TagStatItem } from "@/api/actions/fetchTags"
import NextLink from "next/link"

const MainTemplate: React.FC<{ tags: TagStatItem[] }> = ({ tags }) => {
  const { push } = useRouter()

  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const scrollRef = useRef(null)

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
              />
              <HStack
                fontSize={"sm"}
                color={"gray.500"}
                mt={3}
                gap={isMobile ? 1 : 3}
              >
                <Link as={NextLink} href={"/long-words"}>
                  긴 단어 검색기
                </Link>
                <Text>&nbsp; · &nbsp;</Text>
                <Link as={NextLink} href={"/quiz"}>
                  단어 퀴즈
                </Link>
                <Text>&nbsp; · &nbsp;</Text>
                <Link as={NextLink} href={"https://danoo.kimustory.net"}>
                  다누 끝말잇기 (베타)
                </Link>
                <Text>&nbsp; · &nbsp;</Text>
                <Link as={NextLink} href={"/paring"}>
                  파링이 누르기
                </Link>
              </HStack>
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
          {tags.length ? (
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
                {tags.map((tag) => {
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
                          push("/search?tags=" + encodeURIComponent(tag.tag))
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
