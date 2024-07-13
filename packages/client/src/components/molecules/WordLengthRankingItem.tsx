import React, { useMemo } from "react"
import {
  Heading,
  HStack,
  StackProps,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import ThemeTag from "../atoms/ThemeTag"
import { LongWordItem } from "@/api/actions/fetchLongWords"
import NextLink from "next/link"

const MotionLink = motion(NextLink)

const WordLengthRankingItem: React.FC<
  StackProps & { ranking: number; word: LongWordItem }
> = ({ word, ranking, ...props }) => {
  const colorScheme = useMemo(() => {
    if (word.length >= 50) return "red"

    return "gray"
  }, [word])

  const isHighRanking = ranking <= 3

  return (
    <VStack
      as={MotionLink}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      w={"100%"}
      borderColor={`${colorScheme}.500`}
      userSelect={"none"}
      borderWidth={2}
      borderRadius={5}
      px={5}
      py={4}
      position={"relative"}
      mb={1.5}
      alignItems={"flex-start"}
      transition={"background-color 0.2s"}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
        cursor: "pointer",
      }}
      gap={1}
      href={`/search?q=${word.simplifiedName}`}
      {...props}
    >
      <HStack w={"100%"}>
        <Text fontSize={"sm"} color={`${colorScheme}.500`}>
          {ranking}등 | {word.length}글자
        </Text>
      </HStack>
      <Heading
        color={useColorModeValue(
          isHighRanking ? "gray.800" : "gray.500",
          isHighRanking ? "gray.100" : "gray.400",
        )}
        fontSize={ranking <= 3 ? "xl" : "lg"}
      >
        {word.simplifiedName}
      </Heading>
      {word.tags.length ? (
        <HStack mt={2} w={"100%"} flexWrap={"wrap"}>
          {word.tags.map((tag) => (
            <ThemeTag tag={tag} key={tag} />
          ))}
        </HStack>
      ) : null}
    </VStack>
  )
}

export default WordLengthRankingItem
