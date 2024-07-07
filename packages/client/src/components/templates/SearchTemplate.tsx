import React, { useEffect } from "react"
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

const SearchTemplate: React.FC<{
  keyword: string
  searchResults: Word[]
  onEndReached?: () => void
  isLoading: boolean
  allLoaded: boolean
  totalCount: number
}> = ({
  keyword,
  searchResults,
  onEndReached,
  totalCount,
  isLoading,
  allLoaded,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [keyword])

  // reset scroll
  const resetScroll = () => {
    window.scrollTo(0, 0)
  }

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
          data={searchResults}
          endReached={onEndReached}
          itemContent={(_index, word) => (
            <WordItem key={"word-" + word.id} word={word} keyword={keyword} />
          )}
          components={{
            Header: () => (
              <SearchHeader keyword={keyword} totalCount={totalCount} />
            ),
            Footer: () => (
              <Footer
                keyword={keyword}
                totalCount={searchResults.length}
                isLoading={isLoading}
                allLoaded={allLoaded}
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
          <Text fontSize={"md"}>
            {"' "}
            <Highlight
              query={keyword}
              styles={{
                color: useColorModeValue("black", "white"),
                fontWeight: "bold",
              }}
            >
              {keyword}
            </Highlight>
            {" ' "}
            검색 결과
          </Text>
        ) : (
          <Text>전체 검색 결과</Text>
        )}
        <Spacer />
        <Text color={"gray.500"} fontSize={"sm"}>
          총 {totalCount}개
        </Text>
      </HStack>
      <Divider mb={5} />
    </VStack>
  )
}

const Footer: React.FC<{
  keyword: string
  allLoaded: boolean
  isLoading: boolean
  totalCount: number
}> = ({ keyword, allLoaded, isLoading, totalCount }) => {
  return (
    <VStack w={"100%"} h={"300px"} mt={20}>
      {!isLoading ? (
        <Text color={"gray.500"}>
          {totalCount && allLoaded
            ? "이게 끝이에요! 더 없어요..."
            : `"${keyword}"에 대한 검색 결과가 없어요...`}
        </Text>
      ) : (
        <Spinner color={"gray.500"} />
      )}
    </VStack>
  )
}

export default SearchTemplate
