import React from "react"
import { Button, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import Header from "../organisms/Header"
import ThemeTag from "../atoms/ThemeTag"

const QuizResultTemplate: React.FC<{
  tags: string[]
  round: number
  onResetGame: () => void
}> = ({ tags, round, onResetGame }) => {
  return (
    <>
      <Header showLogo showSearch />
      <Center w={"100vw"} h={"100vh"}>
        <VStack maxW={"3xl"} gap={3}>
          <Heading>수고 많으셨어요!</Heading>
          <HStack>
            {tags.map((t) => {
              return <ThemeTag tag={t} size={"md"} key={t} />
            })}{" "}
          </HStack>
          <Text>총 라운드 도달: {round}</Text>
          <Text>이 결과를 친구에게 자랑해 보세요!</Text>

          <Button onClick={onResetGame}>돌아가기</Button>
        </VStack>
      </Center>
    </>
  )
}

export default QuizResultTemplate
