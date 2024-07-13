"use client"

import React, { useEffect, useMemo } from "react"
import {
  Container,
  Divider,
  Highlight,
  HStack,
  IconButton,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { Virtuoso } from "react-virtuoso"
import { GoMoveToTop } from "react-icons/go"
import WordItem from "../organisms/WordItem"
import { Word } from "mudict-api-types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { searchWords } from "@/api/actions/searchWords"

const PAGE_SIZE = 50

const SearchTemplate: React.FC<{
  keyword: string
  initialResult: Word[]
  totalCount: number
  tagFilter: string[]
}> = ({ keyword, tagFilter, initialResult, totalCount }) => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["searchWords", { query: keyword }],
    queryFn: async ({ pageParam }) => {
      const { hits } = await searchWords(
        keyword,
        tagFilter,
        PAGE_SIZE,
        pageParam * PAGE_SIZE,
      )
      return hits
    },
    initialData: { pageParams: [0], pages: [initialResult] },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length >= PAGE_SIZE ? pages.length : undefined,
  })

  const words = useMemo(() => data?.pages.flat() || [], [data])

  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const resetScroll = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    resetScroll()
  }, [keyword])

  return (
    <VStack position={"relative"} px={2}>
      <Tooltip label={"가장 위로 이동"} hasArrow>
        <IconButton
          aria-label={"top"}
          isRound
          colorScheme={"gray"}
          icon={<GoMoveToTop />}
          position={"fixed"}
          onClick={resetScroll}
          bottom={5}
          right={8}
          zIndex={999}
        />
      </Tooltip>
      <Header showSearch={true} showLogo={true} />
      <Container maxW={"3xl"} mt={isMobile ? "80px" : "100px"}>
        <Virtuoso
          useWindowScroll
          style={{
            height: "calc(100vh - 100px)",
          }}
          data={words}
          endReached={() => fetchNextPage()}
          initialItemCount={initialResult.length}
          itemContent={(_index, word) => (
            <WordItem
              key={"word-" + word.id}
              word={word}
              keyword={keyword}
              isSummary
            />
          )}
          components={{
            Header: () => (
              <SearchHeader keyword={keyword} totalCount={totalCount} />
            ),
            Footer: () => (
              <Footer
                words={words}
                keyword={keyword}
                isLoading={isLoading}
                allLoaded={!hasNextPage}
              />
            ),
          }}
        />
      </Container>
    </VStack>
  )
}

const SearchHeader: React.FC<{ keyword: string; totalCount: number }> = ({
  keyword,
  totalCount,
}) => {
  return (
    <VStack w={"100%"}>
      <HStack w={"100%"}>
        {keyword ? (
          <Text as={"h1"} fontSize={"md"}>
            {"' "}
            <b>{keyword}</b>
            {" ' "}
            검색 결과
          </Text>
        ) : (
          <Text as={"h1"}>전체 검색 결과</Text>
        )}
        <Spacer />
        <Text flexShrink={0} color={"gray.500"} fontSize={"sm"}>
          총 {totalCount}개
        </Text>
      </HStack>
      <Divider mb={5} />
    </VStack>
  )
}

const Footer: React.FC<{
  words: Word[]
  keyword: string
  allLoaded: boolean
  isLoading: boolean
}> = ({ words, keyword, allLoaded, isLoading }) => {
  return (
    <VStack w={"100%"} h={"300px"} mt={20}>
      {!words.length ? (
        <Text color={"gray.500"}>
          {`"${keyword}"에 대한 검색 결과가 없어요...`}
        </Text>
      ) : isLoading || !allLoaded ? (
        <Spinner color={"gray.500"} />
      ) : (
        <Text color={"gray.500"}>이게 끝이에요! 더 없어요...</Text>
      )}
    </VStack>
  )
}

export default SearchTemplate
