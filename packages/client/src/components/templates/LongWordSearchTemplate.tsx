"use client"

import React, { useMemo } from "react"
import {
  Box,
  Center,
  Container,
  Divider,
  Highlight,
  HStack,
  Input,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { Virtuoso } from "react-virtuoso"
import { FaCrown } from "react-icons/fa"
import WordLengthRankingItem from "../molecules/WordLengthRankingItem"
import { useRouter } from "next-nprogress-bar"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchLongWords, LongWordItem } from "@/api/actions/fetchLongWords"

const PAGE_SIZE = 10
const MAX_RANKING = 100

const LongWordSearchTemplate: React.FC<{
  letter: string
  initialResult: LongWordItem[]
}> = ({ initialResult, letter }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const { replace } = useRouter()

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["fetchLongWords", { letter }],
    queryFn: async ({ pageParam }) =>
      fetchLongWords(letter, PAGE_SIZE, pageParam * PAGE_SIZE),
    initialData: { pageParams: [0], pages: [initialResult] },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length <= MAX_RANKING / PAGE_SIZE ? pages.length : undefined,
  })

  const words = useMemo(() => data?.pages.flat() || [], [data])

  return (
    <VStack position={"relative"} px={2}>
      <Header showSearch={true} showLogo={true} />
      <Container maxW={"3xl"} mt={isMobile ? "80px" : "100px"}>
        <Virtuoso
          useWindowScroll
          style={{
            height: "calc(100vh - 100px)",
          }}
          data={words}
          endReached={() => fetchNextPage()}
          itemContent={(index, word) => (
            <WordLengthRankingItem
              key={`${letter}-${index}`}
              ranking={index + 1}
              word={word}
            />
          )}
          components={{
            Header: () => (
              <SearchHeader
                letter={letter}
                onSearch={(letter: string) => {
                  replace("/long-words?letter=" + encodeURIComponent(letter))
                }}
              />
            ),
            Footer: () =>
              isLoading ? (
                <Center mt={20}>
                  <Spinner color={"gray.500"} />
                </Center>
              ) : (
                <Box h={"200px"} />
              ),
          }}
        />
      </Container>
    </VStack>
  )
}

const SearchHeader: React.FC<{
  letter: string | null
  onSearch: (letter: string) => void
}> = ({ letter, onSearch }) => {
  const [searchLetter, setSearchLetter] = React.useState<string>("")

  return (
    <VStack w={"100%"}>
      <HStack w={"100%"} gap={3}>
        <FaCrown size={"20px"} />
        {!letter ? (
          <Text fontSize={"md"} fontWeight={"800"}>
            한국어 긴 단어 TOP 100
          </Text>
        ) : (
          <Text fontSize={"md"}>
            {"'"}
            <b>{letter}</b>
            {"'"}로 시작하는 긴 단어 목록
          </Text>
        )}
        <Spacer />
        <Text>시작 글자 검색</Text>
        <Input
          bgColor={useColorModeValue("gray.200", "gray.700")}
          w={"50px"}
          maxLength={1}
          placeholder={letter || "가"}
          onChange={(e) => setSearchLetter(e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(searchLetter)
          }}
        />
      </HStack>
      <Divider mb={5} />
    </VStack>
  )
}

export default LongWordSearchTemplate
