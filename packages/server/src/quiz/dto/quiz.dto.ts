import { QuizHint, QuizType } from 'mudict-api-types';

export class QuizDto {
  id: string;
  quizType: QuizType;
  hints: QuizHint[];
  tags: string[];
  answer: string;
}
