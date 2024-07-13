import React, { useMemo } from "react"
import {
  Box,
  Highlight,
  HStack,
  IconButton,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { IoVolumeMedium } from "react-icons/io5"
import PosTag from "../atoms/PosTag"
import ThemeTag from "../atoms/ThemeTag"
import { FaCopy, FaLink, FaYoutube } from "react-icons/fa6"
import { FaMapMarkedAlt } from "react-icons/fa"
import { Word } from "mudict-api-types"
import getTagData from "../../utils/getTagData"
import NextLink from "next/link"
import { removeHTMLTags } from "@/utils/removeHTMLTags"
import { useSpeech } from "@/hooks/useSpeech"

const WordItem: React.FC<{
  word: Word
  keyword: string
  isSummary?: boolean
}> = ({ word, keyword, isSummary }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const mainTags = useMemo(() => {
    return word.tags.filter((tag) => !tag.includes("/"))
  }, [word.tags])

  const subTags = useMemo(() => {
    return word.tags.filter((tag) => tag.includes("/"))
  }, [word.tags])

  const detailPageUrl = useMemo(
    () => `/words/${word.sourceId}`,
    [word.sourceId],
  )

  const definition = useMemo(() => {
    const def = removeHTMLTags(word.definition)

    if (isSummary) {
      return def.length > 100 ? def.slice(0, 100) + "..." : def
    }

    return def
  }, [word.definition, isSummary])

  const toast = useToast()

  const subTagColor = useMemo(
    () => (subTags[0] ? getTagData(subTags[0]).color : "gray"),
    [subTags],
  )

  const { speech } = useSpeech()

  return (
    <HStack
      // as={motion.div}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      w={"100%"}
      mb={7}
      alignItems={"flex-start"}
    >
      <VStack w={"100%"}>
        <HStack w={"100%"} flexWrap={"wrap"} rowGap={0}>
          <Text
            flexShrink={0}
            maxW={"100%"}
            fontSize={isMobile ? "md" : "lg"}
            fontWeight={"bold"}
          >
            <Link as={NextLink} href={detailPageUrl}>
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
              <Text
                flexShrink={0}
                maxW={"100%"}
                fontSize={isMobile ? "sm" : "md"}
                color={"gray.500"}
              >
                ({word.origin})
              </Text>
            </Tooltip>
          )}
          {word.pronunciation && (
            <Text
              flexShrink={0}
              maxW={"100%"}
              fontSize={isMobile ? "sm" : "md"}
              color={"gray.500"}
            >
              [{word.pronunciation}]
            </Text>
          )}
          <HStack gap={0}>
            <IconButton
              aria-label={"copy word"}
              icon={<FaCopy />}
              variant={"ghost"}
              isRound
              size={"sm"}
              color={"gray.500"}
              onClick={() => {
                navigator.clipboard.writeText(word.name).then()
                toast({
                  status: "success",
                  title: "단어가 복사되었습니다",
                  duration: 1000,
                })
              }}
            />
            <IconButton
              aria-label={"play sound"}
              icon={<IoVolumeMedium />}
              variant={"ghost"}
              isRound
              size={"sm"}
              color={"gray.500"}
              onClick={() => speech(word.pronunciation || word.name)}
            />
            {word.url ? (
              <Tooltip label={word.url} hasArrow openDelay={500}>
                <IconButton
                  aria-label={"link"}
                  icon={
                    /youtube/.test(word.url) ? (
                      <FaYoutube />
                    ) : /map/.test(word.url) ? (
                      <FaMapMarkedAlt />
                    ) : (
                      <FaLink />
                    )
                  }
                  variant={"ghost"}
                  isRound
                  size={"sm"}
                  color={"gray.500"}
                  onClick={() => (window.location.href = word.url!)}
                />
              </Tooltip>
            ) : null}
          </HStack>
        </HStack>
        <Box w={"100%"}>
          <Text fontSize={isMobile ? "sm" : "md"} as="div">
            <HStack display={"inline-flex"} mr={3} gap={1}>
              <PosTag pos={word.pos} />
              {mainTags.map((tag, idx) => (
                <ThemeTag key={`${word.id}-${idx}`} tag={tag} />
              ))}
              {subTags.length ? (
                <Popover>
                  <PopoverTrigger>
                    <Tag
                      cursor={"pointer"}
                      userSelect={"none"}
                      size={"sm"}
                      colorScheme={subTagColor}
                    >
                      ...
                    </Tag>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <HStack gap={2} flexWrap={"wrap"}>
                        {subTags.map((tag, idx) => (
                          <ThemeTag key={`${word.id}-${idx}`} tag={tag} />
                        ))}
                      </HStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : null}
            </HStack>
            <NextLink href={detailPageUrl}>{definition}</NextLink>
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

export default WordItem
