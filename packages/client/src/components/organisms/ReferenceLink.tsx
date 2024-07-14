import React from "react"
import { HStack, Text, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { FaArrowCircleRight } from "react-icons/fa"
import NextLink from "next/link"
import { Word } from "mudict-api-types"

const ReferenceLink: React.FC<{ colorScheme: string; word: Word }> = ({
  colorScheme,
  word,
}) => {
  if (!word.url) return null

  return (
    <HStack color={useColorModeValue(`gray.500`, `gray.400`)} ml={3} gap={3}>
      <FaArrowCircleRight
        color={useColorModeValue(
          `var(--chakra-colors-${colorScheme}-300)`,
          `var(--chakra-colors-${colorScheme}-400)`,
        )}
      />
      <Text>
        이 단어에 대한 자세한 정보는{" "}
        <Tooltip label={word.url} aria-label="단어 출처">
          <Text
            as={NextLink}
            fontWeight={"600"}
            href={word.url}
            color={useColorModeValue(
              `${colorScheme}.500`,
              `${colorScheme}.400`,
            )}
          >
            여기
          </Text>
        </Tooltip>
        에서 확인하실 수 있습니다.
      </Text>
    </HStack>
  )
}

export default ReferenceLink
