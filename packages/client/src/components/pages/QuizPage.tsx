import React, { useEffect } from "react"
import QuizSettingTemplate from "../templates/QuizSettingTemplate"
import { Quiz } from "mudict-api-types"
import { api } from "../../api/api"
import { TagStatItem } from "./Main"
import QuizTemplate from "../templates/QuizTemplate"
import { useToast } from "@chakra-ui/react"
import QuizResultTemplate from "../templates/QuizResultTemplate"
import { isAxiosError } from "axios"

const QuizPage: React.FC = () => {
  // Setting
  const [tagStats, setTagStats] = React.useState<TagStatItem[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  // Game
  const [coin, setCoin] = React.useState(100)
  const [quiz, setQuiz] = React.useState<Quiz | null>(null)
  const [round, setRound] = React.useState(0)

  const [isEnd, setIsEnd] = React.useState(false)

  const [quizIds, setQuizIds] = React.useState<string[]>([])

  const toast = useToast()

  const fetchTags = async () => {
    const res = await api.get("/statistics/tags")
    res.data.sort((a: TagStatItem, b: TagStatItem) => b.count - a.count)
    setTagStats(res.data)
  }

  const fetchQuiz = async () => {
    try {
      const res = await api.get("/quiz", {
        params: {
          tags: selectedTags,
          exclude: quizIds,
        },
      })

      setQuizIds([...quizIds, res.data.id])
      setRound(round + 1)
      setQuiz(res.data)
    } catch (e) {
      if (!isAxiosError(e)) throw e

      if (e.response?.status === 404) {
        toast({
          title: "모든 퀴즈를 다 풀었어요!!!.",
          description: "클리어를 축하드려요!!",
          status: "info",
          isClosable: true,
          position: "top-right",
        })
      }
    }
  }

  useEffect(() => {
    if (coin > 0) return
    setIsEnd(true)
    toast({
      title: "게임 오버!",
      description: "코인이 부족합니다. 게임을 종료합니다.",
      status: "error",
      duration: 900,
      isClosable: true,
      position: "top-right",
    })
  }, [coin])

  const onSkip = () => {
    fetchQuiz().then()
    setCoin(coin - 10)
    toast({
      title: "10코인이 차감되었습니다.",
      description: "정답: " + quiz?.answer,
      status: "info",
      duration: 900,
      isClosable: true,
      position: "top-right",
    })
  }

  const onSubmit = (answer: string) => {
    if (quiz?.answer === answer) {
      const gainedCoins = quiz?.answer.length * 10
      toast({
        title: "정답입니다!",
        description: `${gainedCoins} 에너지가 충전되었습니다.`,
        status: "success",
        duration: 900,
        isClosable: true,
        position: "top-right",
      })
      setCoin(coin + gainedCoins)
    } else {
      toast({
        title: "틀렸습니다.",
        description: "1 에너지가 차감되었습니다. 다시 시도해보세요.",
        status: "error",
        duration: 900,
        isClosable: true,
        position: "top-right",
      })
      setCoin(coin - 1)
      return
    }
    fetchQuiz().then()
  }

  const resetGame = () => {
    setCoin(100)
    setQuiz(null)
    setRound(0)
    setQuizIds([])
    setIsEnd(false)
  }

  useEffect(() => {
    fetchTags().then()
  }, [])

  return !quiz ? (
    <QuizSettingTemplate
      tags={tagStats}
      selectedTags={selectedTags}
      onSelectedTagsChange={setSelectedTags}
      onQuizStart={() => {
        setCoin(100)
        fetchQuiz().then()
      }}
    />
  ) : !isEnd ? (
    <QuizTemplate
      coin={coin}
      quiz={quiz}
      round={round}
      onSkip={onSkip}
      onSubmit={onSubmit}
      onUseCoin={(amount) => {
        setCoin(coin - amount)
      }}
    />
  ) : (
    <QuizResultTemplate
      round={round}
      coin={coin}
      tags={selectedTags}
      onResetGame={resetGame}
    />
  )
}

export default QuizPage
