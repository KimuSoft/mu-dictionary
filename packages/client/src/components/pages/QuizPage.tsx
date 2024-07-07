import React, { useEffect } from "react"
import QuizSettingTemplate from "../templates/QuizSettingTemplate"
import { Quiz } from "mudict-api-types"
import { api } from "../../api/api"
import { TagStatItem } from "./Main"
import QuizTemplate from "../templates/QuizTemplate"
import { useToast } from "@chakra-ui/react"
import QuizResultTemplate from "../templates/QuizResultTemplate"

const QuizPage: React.FC = () => {
  // Setting
  const [tagStats, setTagStats] = React.useState<TagStatItem[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  // Game
  const [coin, setCoin] = React.useState(100)
  const [quiz, setQuiz] = React.useState<Quiz | null>(null)
  const [round, setRound] = React.useState(0)

  const toast = useToast()

  const fetchTags = async () => {
    const res = await api.get("/statistics/tags")
    res.data.sort((a: TagStatItem, b: TagStatItem) => b.count - a.count)
    setTagStats(res.data)
  }

  const fetchQuiz = async () => {
    const res = await api.get("/quiz", {
      params: {
        tags: selectedTags,
      },
    })

    setRound(round + 1)
    setQuiz(res.data)
  }

  useEffect(() => {
    if (coin > 0) return
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
  ) : coin > 0 ? (
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
      tags={selectedTags}
      onResetGame={resetGame}
    />
  )
}

export default QuizPage
