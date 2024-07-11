import React from "react"
import { fetchTags } from "@/api/actions/fetchTags"
import QuizPage from "@/app/quiz/quizPage"

const Page: React.FC = async () => {
  const tags = await fetchTags()

  return <QuizPage tags={tags} />
}

export default Page
