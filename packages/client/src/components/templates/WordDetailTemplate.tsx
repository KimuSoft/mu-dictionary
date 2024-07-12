"use client"

import React, { useMemo } from "react"
import {
  Container,
  Divider,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  Textarea,
  Tooltip,
  useColorMode,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Word } from "mudict-api-types"
import getTagData from "@/utils/getTagData"
import Header from "@/components/organisms/Header"
import ThemeTag from "@/components/atoms/ThemeTag"
import PosTag from "@/components/atoms/PosTag"
import { FaCopy, FaLink, FaYoutube } from "react-icons/fa6"
import { IoVolumeMedium } from "react-icons/io5"
import { FaMapMarkedAlt, FaRegQuestionCircle } from "react-icons/fa"
import { PiApproximateEqualsFill } from "react-icons/pi"
import { LuFileJson2 } from "react-icons/lu"
import WordItem from "@/components/organisms/WordItem"
import { removeHTMLTags } from "@/utils/removeHTMLTags"

const WordDetailTemplate: React.FC<{ word: Word; homonyms: Word[] }> = ({
  word,
  homonyms,
}) => {
  const { colorMode } = useColorMode()
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const toast = useToast()

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

  const colorScheme = useMemo(
    () => getTagData(word.tags[0] || "").color,
    [word.tags],
  )

  const background = useMemo(() => {
    return `linear-gradient(45deg, var(--chakra-colors-${colorScheme}-${colorMode === "light" ? "300" : "700"}) 0%, var(--chakra-colors-${colorScheme}-${colorMode === "light" ? "100" : "500"}) 100%);`
  }, [colorScheme, colorMode])

  return (
    <VStack w={"100%"} pb={"100px"}>
      <Header showLogo showSearch position={"absolute"} bg={"transparent"} />
      <HStack
        w={"100%"}
        minH={"200px"}
        bg={background}
        alignItems={"flex-end"}
        py={10}
      >
        <Container px={7} pt={"65px"} maxW={"3xl"} position={"relative"}>
          <VStack gap={4} w={"100%"} alignItems={"flex-start"}>
            <HStack
              w={word.thumbnail ? "calc(100% - 150px)" : "100%"}
              flexWrap={"wrap"}
              gap={5}
              rowGap={2}
            >
              <Heading fontSize={"3xl"}>{word.name}</Heading>
              {word.origin !== word.name && (
                <Tooltip label={"단어의 유래"} openDelay={500}>
                  <Text
                    flexShrink={0}
                    maxW={"100%"}
                    fontSize={isMobile ? "sm" : "md"}
                    color={
                      colorMode === "light"
                        ? "blackAlpha.700"
                        : "whiteAlpha.700"
                    }
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
                  color={
                    colorMode === "light" ? "blackAlpha.700" : "whiteAlpha.700"
                  }
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
                  color={
                    colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.500"
                  }
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
                  color={
                    colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.500"
                  }
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
                      color={
                        colorMode === "light"
                          ? "blackAlpha.500"
                          : "whiteAlpha.500"
                      }
                      onClick={() => (window.location.href = word.url!)}
                    />
                  </Tooltip>
                ) : null}
              </HStack>
            </HStack>
            <HStack gap={2} flexWrap={"wrap"}>
              <PosTag pos={word.pos} />
              {word.tags.map((tag, idx) => (
                <ThemeTag key={`${word.id}-${idx}`} tag={tag} />
              ))}
            </HStack>
          </VStack>
          {word.thumbnail ? (
            <Image
              position={"absolute"}
              right={5}
              top={"calc(70px)"}
              bgColor={
                colorMode === "light" ? "whiteAlpha.500" : "blackAlpha.500"
              }
              p={1}
              h={"150px"}
              boxShadow={"lg"}
              borderRadius={4}
              objectFit={"cover"}
              alt={word.name}
              src={word.thumbnail}
            />
          ) : null}
        </Container>
      </HStack>

      <Container maxW={"3xl"} px={5} py={7}>
        <VStack w={"100%"} alignItems={"flex-start"} gap={2}>
          {/* Definition */}
          <HStack ml={"15px"} gap={3}>
            <FaRegQuestionCircle
              size={18}
              color={`var(--chakra-colors-${colorScheme}-400)`}
            />
            <Heading fontSize={"xl"}>정의</Heading>
          </HStack>
          <Divider />
          <Text fontSize={"md"} textIndent={"15px"}>
            {removeHTMLTags(word.definition)}
          </Text>

          {/* JSON */}
          <HStack mt={"45px"} ml={"15px"} gap={3}>
            <LuFileJson2
              size={18}
              color={`var(--chakra-colors-${colorScheme}-400)`}
            />
            <Heading fontSize={"xl"}>JSON 데이터</Heading>
          </HStack>
          <Divider />
          <Textarea h={"400px"} defaultValue={JSON.stringify(word, null, 2)} />

          {/* 동음이의어 및 다의어 */}
          <HStack mt={"45px"} ml={"15px"} gap={3}>
            <PiApproximateEqualsFill
              size={18}
              color={`var(--chakra-colors-${colorScheme}-400)`}
            />
            <Heading fontSize={"xl"}>동음이의어 · 다의어</Heading>
          </HStack>
          <Divider />
          <VStack gap={0} mt={5} w={"100%"}>
            {homonyms.map((h) => (
              <WordItem key={h.id} word={h} keyword={""} />
            ))}
          </VStack>
        </VStack>
      </Container>
    </VStack>
  )
}

export default WordDetailTemplate
