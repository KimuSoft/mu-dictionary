import React from "react"
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
import { LongWordItem } from "../pages/LongWordSearch"
import { Virtuoso } from "react-virtuoso"
import { FaCrown } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import WordLengthRankingItem from "../molecules/WordLengthRankingItem"

const LongWordSearchTemplate: React.FC<{
  letter: string | null
  words: LongWordItem[]
  loadMore: () => void
  isAllLoaded: boolean
  isLoading: boolean
}> = ({ words, letter, loadMore, isAllLoaded, isLoading }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const navigate = useNavigate()

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
          endReached={loadMore}
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
                  navigate("/long-word?letter=" + encodeURIComponent(letter))
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
            <Highlight
              query={letter}
              styles={{
                color: useColorModeValue("black", "white"),
                fontWeight: "bold",
              }}
            >
              {letter}
            </Highlight>
            '로 시작하는 긴 단어 목록
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
