import { QuizHint } from "./quiz-hint"

export interface Quiz {
  id: string
  quizType: QuizType
  hints: QuizHint[]
  tags: string[]
  answer: string
}

export enum QuizType {
  Word,
}
