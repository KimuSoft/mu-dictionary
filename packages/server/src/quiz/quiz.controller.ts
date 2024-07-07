import { Controller, Get, Query } from '@nestjs/common';
import { GetRandomQuizDto } from './dto/get-random-quiz.dto';
import { ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';

@ApiTags('Quiz')
@Controller('api/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async randomQuiz(@Query() dto: GetRandomQuizDto) {
    return this.quizService.getRandomQuiz(dto);
  }
}
