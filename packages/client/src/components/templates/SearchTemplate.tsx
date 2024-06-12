import React from "react"
import Word from "../organisms/Word"
import { Text, VStack } from "@chakra-ui/react"
import Header from "../organisms/Header"
import { Homonym } from "../../types/types"

const SearchTemplate: React.FC<{
  keyword: string
  searchResults: Homonym[]
}> = ({ keyword, searchResults }) => {
  return (
    <VStack>
      <Header showSearch={true} showLogo={true} />
      <VStack>
        {searchResults.length ? (
          searchResults.map((homonym, i) => <Word key={i} homonym={homonym} />)
        ) : (
          <Text>"{keyword}"에 대한 검색 결과가 없어요...</Text>
        )}
      </VStack>
    </VStack>
  )
}

export default SearchTemplate
