import React from "react"
import {
  Box,
  Container,
  Divider,
  Highlight,
  HStack,
  Image,
  Link,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { IWord } from "../../types/types"
import { Virtuoso } from "react-virtuoso"
import ThemeTag from "../atoms/ThemeTag"
import PosTag from "../atoms/PosTag"

const Word: React.FC<{ word: IWord; keyword: string }> = ({
  word,
  keyword,
}) => {
  return (
    <HStack w={"100%"} mb={7} alignItems={"flex-start"}>
      <VStack w={"100%"}>
        <HStack w={"100%"}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            <Link href={word.url}>
              <Highlight
                query={keyword}
                styles={{
                  color: useColorModeValue("white", "black"),
                  bg: useColorModeValue("gray.600", "gray.200"),
                }}
              >
                {word.name}
              </Highlight>
            </Link>
          </Text>
          {word.origin !== word.name && (
            <Tooltip label={"단어의 유래"} openDelay={500}>
              <Text color={"gray.500"}>({word.origin})</Text>
            </Tooltip>
          )}
          {word.pronunciation && (
            <Text color={"gray.500"}>[{word.pronunciation}]</Text>
          )}
        </HStack>
        <Box w={"100%"}>
          <Text>
            <HStack display={"inline-flex"} mr={3} gap={1}>
              <PosTag pos={word.pos} />
              {word.tags.map((tag) => (
                <ThemeTag tag={tag} />
              ))}
            </HStack>
            {word.definition}
          </Text>
        </Box>
      </VStack>
      {word.thumbnail && (
        <Image
          w={"80px"}
          borderRadius={4}
          objectFit={"cover"}
          alt={word.name}
          src={word.thumbnail}
        />
      )}
    </HStack>
  )
}

const SearchTemplate: React.FC<{
  keyword: string
  searchResults: IWord[]
  onEndReached?: () => void
  isLoading?: boolean
  allLoaded?: boolean
}> = ({ keyword, searchResults, onEndReached, isLoading, allLoaded }) => {
  return (
    <VStack>
      <Header showSearch={true} showLogo={true} />
      <Container maxW={"3xl"}>
        <Divider />
        <Virtuoso
          useWindowScroll
          style={{
            marginTop: "100px",
            height: "calc(100vh - 100px)",
          }}
          data={searchResults}
          endReached={onEndReached}
          itemContent={(index, word) => (
            <Word key={index} word={word} keyword={keyword} />
          )}
          components={{
            Header: () => (
              <SearchHeader
                keyword={keyword}
                totalCount={searchResults.length}
              />
            ),
            Footer: () => (
              <Footer
                keyword={keyword}
                totalCount={searchResults.length}
                isLoading={!!isLoading}
                allLoaded={!!allLoaded}
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
    <VStack w={"100%"} h={"300px"}>
      {!isLoading ? (
        <Text color={"gray.500"}>
          {totalCount && allLoaded
            ? "이게 끝이에요! 더 없어요..."
            : `"${keyword}"에 대한 검색 결과가 없어요...`}
        </Text>
      ) : (
        <Spinner />
      )}
    </VStack>
  )
}

export default SearchTemplate
