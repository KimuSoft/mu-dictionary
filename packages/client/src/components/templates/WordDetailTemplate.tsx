"use client"

import React, { useMemo } from "react"
import {
  Container,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
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
import { IoShareSocial, IoVolumeMedium } from "react-icons/io5"
import { FaMapMarkedAlt } from "react-icons/fa"
import { useSpeech } from "@/hooks/useSpeech"
import DefinitionSection from "@/components/organisms/sections/DefinitionSection"
import HomonymSection from "@/components/organisms/sections/HomonymSection"
import MapSection from "@/components/organisms/sections/MapSection"
import InfoTable from "@/components/organisms/InfoTable"
import { MdUpdate } from "react-icons/md"

const WordDetailTemplate: React.FC<{
  word: Word
  homonyms: Word[]
  kakaoMapAppKey: string
}> = ({ word, homonyms, kakaoMapAppKey }) => {
  const { colorMode } = useColorMode()
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const toast = useToast()

  const { speech } = useSpeech()

  const colorScheme = useMemo(
    () => getTagData(word.tags[0] || "").color,
    [word.tags],
  )

  const lastUpdatedDateStr = useMemo(() => {
    const date = new Date(word.updatedAt)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }, [word.updatedAt])

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
        <Container
          px={7}
          pt={"65px"}
          maxW={"5xl"}
          position={"relative"}
          display={"flex"}
          flexDir={"row"}
          gap={3}
        >
          <VStack
            gap={3}
            w={"100%"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <HStack w={"100%"} flexWrap={"wrap"} gap={4} rowGap={2}>
              <Heading as={"h1"} fontSize={"3xl"}>
                {word.name}
              </Heading>
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
                  icon={<IoShareSocial />}
                  variant={"ghost"}
                  isRound
                  size={"sm"}
                  color={
                    colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.500"
                  }
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/words/${word.sourceId}`,
                    )
                    toast({
                      status: "success",
                      title: "URL이 복사되었습니다",
                      duration: 1000,
                    })
                  }}
                />
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
              bgColor={
                colorMode === "light" ? "whiteAlpha.500" : "blackAlpha.500"
              }
              p={1}
              maxW={isMobile ? "200px" : "400px"}
              maxH={"150px"}
              boxShadow={"lg"}
              borderRadius={4}
              objectFit={"contain"}
              alt={word.name}
              src={word.thumbnail}
            />
          ) : null}
        </Container>
      </HStack>

      <Container
        maxW={"5xl"}
        px={5}
        py={7}
        display={"flex"}
        flexDir={"column"}
        alignItems={"flex-start"}
        gap={10}
      >
        <HStack
          gap={7}
          alignItems={"flex-start"}
          flexDir={isMobile ? "column-reverse" : "row"}
        >
          {/* 정의 */}
          <DefinitionSection
            definition={word.definition}
            colorScheme={colorScheme}
          />

          <InfoTable
            w={isMobile ? "100%" : "300px"}
            word={word}
            colorScheme={colorScheme}
          />
        </HStack>

        {/* 위치 */}
        <MapSection
          word={word}
          colorScheme={colorScheme}
          kakaoMapAppKey={kakaoMapAppKey}
        />

        {/* 메타데이터 */}
        {/*<MetadataSection word={word} colorScheme={colorScheme} />*/}

        {/* 동음이의어 및 다의어 */}
        <HomonymSection homonyms={homonyms} colorScheme={colorScheme} />

        <HStack
          mt={5}
          fontSize={"sm"}
          color={`gray.500`}
          w={"100%"}
          justifyContent={"center"}
        >
          <MdUpdate />
          <Text>이 문서는 {lastUpdatedDateStr}에 갱신되었습니다.</Text>
        </HStack>
      </Container>
    </VStack>
  )
}

export default WordDetailTemplate
