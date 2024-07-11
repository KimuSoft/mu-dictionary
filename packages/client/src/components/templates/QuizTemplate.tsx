"use client"

import React, { useMemo } from "react"
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Image,
  Input,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { MdElectricBolt } from "react-icons/md"
import { HintType, Quiz, QuizHint } from "mudict-api-types"
import ThemeTag from "../atoms/ThemeTag"
import getTagData from "../../utils/getTagData"
import { AnimatePresence, motion } from "framer-motion"
import { FaSearch } from "react-icons/fa"

const HintItem: React.FC<{
  hint: QuizHint
  colorScheme: string
  myCoin: number
  onOpen: (cost: number) => void
}> = ({ hint, colorScheme, myCoin, onOpen }) => {
  const [isOpened, setIsOpened] = React.useState(false)

  const Openable = useMemo(() => {
    return hint.cost <= myCoin
  }, [hint.cost, myCoin])

  const hintElement = useMemo(() => {
    switch (hint.hintType) {
      case HintType.Consonants:
        return (
          <Text as={"b"} fontSize={"lg"}>
            {hint.content}
          </Text>
        )
      case HintType.Definition:
        return <Text>{hint.content}</Text>
      case HintType.Image:
        return <Image src={hint.url} alt={"이미지 단서"} borderRadius={5} />
      case HintType.LetterCount:
        return (
          <Text fontSize={"lg"}>
            총 <b>{hint.count}글자</b>로 이루어져 있어!
          </Text>
        )
      case HintType.Youtube:
        return "영상 단서"
      case HintType.YoutubeSound:
        return "소리 단서"
      case HintType.PartialHint:
        return "부분 단어 단서"
    }
  }, [hint])

  const hintTypeStr = useMemo(() => {
    switch (hint.hintType) {
      case HintType.Consonants:
        return "초성 단서"
      case HintType.Definition:
        return "의미 단서"
      case HintType.Image:
        return "이미지 단서"
      case HintType.LetterCount:
        return "글자 수 단서"
      case HintType.Youtube:
        return "영상 단서"
      case HintType.YoutubeSound:
        return "소리 단서"
      case HintType.PartialHint:
        return "부분 단어 단서"
    }
  }, [hint.hintType])

  const borderColor = useColorModeValue(
    `${colorScheme}.300`,
    `${colorScheme}.500`,
  )

  return (
    <Box
      userSelect={"none"}
      as={motion.div}
      layout
      w={"100%"}
      borderWidth={1}
      borderRadius={5}
      px={3}
      py={2}
      cursor={isOpened ? "default" : "pointer"}
      transition={"background-color 0.2s"}
      _hover={
        isOpened ? {} : { bgColor: useColorModeValue("gray.200", "gray.700") }
      }
      borderColor={isOpened ? "gray.500" : borderColor}
      onClick={() => {
        if (!Openable || isOpened) return
        setIsOpened(true)
        onOpen(hint.cost)
      }}
    >
      {isOpened ? (
        <Center
          key={`hint-${hint.hintType}`}
          as={motion.div}
          initial={{ opacity: 0, y: "-100%" }}
          position={"relative"}
          animate={{ opacity: 1, y: 0 }}
          pl={"100px"}
          w={"100%"}
        >
          <Tag size={"sm"} position={"absolute"} left={0}>
            <TagLeftIcon as={FaSearch} />
            <TagLabel>{hintTypeStr}</TagLabel>
          </Tag>
          {hintElement}
        </Center>
      ) : (
        <Center
          key={`hint-button-${hint.hintType}`}
          as={motion.div}
          initial={{ y: "-100px" }}
          animate={{ y: 0 }}
          position={"relative"}
          w={"100%"}
        >
          <Tag position={"absolute"} left={0} colorScheme={colorScheme}>
            <TagLeftIcon as={MdElectricBolt} />
            <TagLabel>-{hint.cost}</TagLabel>
          </Tag>
          <Text color={"gray.500"}>
            {hintTypeStr}{" "}
            {Openable ? "" : "(에너지가 부족해 개방할 수 없습니다)"}
          </Text>
        </Center>
      )}
    </Box>
  )
}

const QuizTemplate: React.FC<{
  coin: number
  quiz: Quiz
  onSubmit: (answer: string) => void
  onUseCoin: (amount: number) => void
  onSkip: () => void
  round: number
}> = ({ coin, quiz, round, onUseCoin, onSkip, onSubmit }) => {
  const [answer, setAnswer] = React.useState("")

  const colorScheme = useMemo(() => {
    return getTagData(quiz.tags[0]).color
  }, [quiz.tags])

  return (
    <>
      <Header bgColor={"transparent"} showLogo />
      <Center
        w={"100vw"}
        h={"100vh"}
        px={3}
        bg={useColorModeValue(
          `linear-gradient(180deg, var(--chakra-colors-${colorScheme}-200) 0%, var(--chakra-colors-gray-200) 100%);`,
          `linear-gradient(180deg, var(--chakra-colors-${colorScheme}-700) 0%, var(--chakra-colors-gray-900) 100%);`,
        )}
      >
        <Container maxW={"5xl"} display={"flex"} flexDir={"column"} gap={3}>
          <AnimatePresence mode={"wait"}>
            <VStack
              key={`container-${round}}`}
              as={motion.div}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              bgColor={useColorModeValue("white", "gray.800")}
              px={5}
              py={3}
              borderRadius={5}
              boxShadow={"xl"}
              w={"100%"}
              gap={3}
            >
              <HStack w={"100%"}>
                <Tag colorScheme={colorScheme}>제{round}문제</Tag>
                <Spacer />

                <Tag>
                  <TagLabel>
                    정답을 맞추면 에너지 {quiz.answer.length * 10} 충전
                  </TagLabel>
                </Tag>
                <Tag colorScheme={colorScheme}>
                  <TagLeftIcon as={MdElectricBolt} />
                  <TagLabel>{coin}</TagLabel>
                </Tag>
              </HStack>
              <Divider />
              <VStack gap={2} h={"65vh"} w={"100%"} overflowY={"auto"}>
                <HStack justifyContent={"center"} w={"100%"} flexWrap={"wrap"}>
                  {quiz.tags.map((tag) => (
                    <ThemeTag size={"md"} tag={tag} key={tag} />
                  ))}
                </HStack>
                {
                  // 힌트 표시
                  quiz.hints.map((hint, i) => (
                    <HintItem
                      key={`hint-item-${i}-${round}`}
                      colorScheme={colorScheme}
                      hint={hint}
                      myCoin={coin}
                      onOpen={(cost) => {
                        onUseCoin(cost)
                      }}
                    />
                  ))
                }
              </VStack>
            </VStack>
          </AnimatePresence>
          <HStack>
            <Input
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value)
              }}
              onKeyDown={(e) => {
                const content = answer.replace(
                  /[^ㄱ-ㅎㅏ-ㅣ가-힣0-9\u3165-\u318e]/g,
                  "",
                )
                if (!content || e.key !== "Enter") return
                // 내용 비움
                setAnswer("")
                onSubmit(content)
              }}
              placeholder={"정답을 입력한 후 Enter를 눌러주세요"}
            />
            <Button gap={2} w={"150px"} onClick={onSkip} flexShrink={0}>
              {coin < 10 ? "포기" : "스킵"}
              <Tag colorScheme={colorScheme}>
                <TagLeftIcon as={MdElectricBolt} />
                <TagLabel>-10</TagLabel>
              </Tag>
            </Button>
          </HStack>
        </Container>
      </Center>
    </>
  )
}

export default QuizTemplate
