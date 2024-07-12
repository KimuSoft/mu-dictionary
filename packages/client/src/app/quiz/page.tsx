import React from "react"
import { fetchTags } from "@/api/actions/fetchTags"
import QuizPage from "@/app/quiz/quizPage"

export const dynamic = "force-dynamic"

const Page: React.FC = async () => {
  const tags = await fetchTags()

  return <QuizPage tags={tags} />
}

export const generateMetadata = async () => {
  return {
    title: `단어 퀴즈`,
    description: "내 전문분야의 주제에서 최고의 점수를 기록해 보세요!",
    keywords: ["퀴즈", "quiz", "단어 퀴즈", "게임", "단어 게임", "초성퀴즈"],
    classification: "game",
  }
}

export default Page
