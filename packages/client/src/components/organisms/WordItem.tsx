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
import { motion } from "framer-motion"
import { FaMapMarkedAlt } from "react-icons/fa"
import { Word } from "mudict-api-types"
import getTagData from "../../utils/getTagData"

const removeHTMLTags = (str: string) => {
  return str.replace(/<[^>]*>?/gm, "").replace(/&[A-z]{0,5};/, "")
}

const WordItem: React.FC<{ word: Word; keyword: string }> = ({
  word,
  keyword,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const mainTags = useMemo(() => {
    return word.tags.filter((tag) => !tag.includes("/"))
  }, [word.tags])

  const subTags = useMemo(() => {
    return word.tags.filter((tag) => tag.includes("/"))
  }, [word.tags])

  const toast = useToast()

  const subTagColor = useMemo(
    () => (subTags[0] ? getTagData(subTags[0]).color : "gray"),
    [subTags],
  )

  const getSpeech = (text: string) => {
    let voices: SpeechSynthesisVoice[] = []

    text = text.replace(/[\^-]/g, "")

    //디바이스에 내장된 voice를 가져온다.
    const setVoiceList = () => {
      voices = window.speechSynthesis.getVoices()
    }

    setVoiceList()

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      // voice list에 변경됐을때, voice를 다시 가져온다.
      window.speechSynthesis.onvoiceschanged = setVoiceList
    }

    const speech = (txt: string) => {
      const lang = "ko-KR"
      const utterThis = new SpeechSynthesisUtterance(txt)

      utterThis.lang = lang

      /* 한국어 vocie 찾기
         디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
      */
      const kor_voice = voices.find(
        (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_"),
      )

      //힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
      if (kor_voice) {
        utterThis.voice = kor_voice
      } else {
        return
      }

      //utterance를 재생(speak)한다.
      window.speechSynthesis.speak(utterThis)
    }

    speech(text)
  }

  return (
    <HStack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
              onClick={() => getSpeech(word.pronunciation || word.name)}
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
          <Text fontSize={isMobile ? "sm" : "md"}>
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
            {removeHTMLTags(word.definition)}
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
