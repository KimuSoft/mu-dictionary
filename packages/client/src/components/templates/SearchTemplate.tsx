import React from "react"
import Word from "../organisms/Word"
import {
  Box,
  Container,
  Divider,
  Highlight,
  HStack,
  Link,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { Homonym, IWord } from "../../types/types"
import { Virtuoso } from "react-virtuoso"
import ThemeTag from "../atoms/ThemeTag"
import PosTag from "../atoms/PosTag"

const SearchTemplate: React.FC<{
  keyword: string
  searchResults: IWord[]
  onEndReached?: () => void
}> = ({ keyword, searchResults, onEndReached }) => {
  return (
    <VStack>
      <Header showSearch={true} showLogo={true} />
      <Container maxW={"3xl"}>
        <Divider />
        <Virtuoso
          style={{
            marginTop: "100px",
            height: "calc(100vh - 100px)",
          }}
          data={searchResults}
          endReached={onEndReached}
          itemContent={(index, word) => (
            <VStack w={"100%"} mb={7}>
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
              <HStack w={"100%"}>
                <PosTag pos={word.pos} />
                {word.tags.map((tag) => (
                  <ThemeTag tag={tag} />
                ))}
                <Text>{word.definition}</Text>
              </HStack>
            </VStack>
          )}
          components={{
            Header: () => (
              <SearchHeader
                keyword={keyword}
                totalCount={searchResults.length}
              />
            ),
            Footer: () => (
              <Footer keyword={keyword} totalCount={searchResults.length} />
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

const Footer: React.FC<{ keyword: string; totalCount: number }> = ({
  keyword,
  totalCount,
}) => {
  return (
    <VStack w={"100%"}>
      <Text color={"gray.500"}>
        {totalCount ? "" : `"${keyword}"에 대한 검색 결과가 없어요...`}
      </Text>
    </VStack>
  )
}

export default SearchTemplate
