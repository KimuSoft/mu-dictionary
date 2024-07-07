import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from '../words/word.entity';
import { Repository } from 'typeorm';
import { GetRandomQuizDto } from './dto/get-random-quiz.dto';
import { Hint, HintType, QuizDto, QuizType } from './dto/quiz.dto';
import * as hangul from 'hangul-js';
import { uniq } from 'lodash';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  public async getRandomQuiz(dto: GetRandomQuizDto): Promise<QuizDto> {
    // 지금은 단어 퀴즈만 제공
    return this.getWordQuiz(dto);
  }

  private async getWordQuiz(dto: GetRandomQuizDto): Promise<QuizDto> {
    // 랜덤으로 조건에 맞는 단어 하나를 가져옴
    let query = this.wordRepository
      .createQueryBuilder()
      .select('"simplifiedName"');

    console.log(dto);
    if (dto.tags.length) {
      query = query.andWhere('"tags" && :tags', { tags: dto.tags });
    }

    console.info(query.getQuery());

    const word = await query
      .orderBy('thumbnail IS NOT NULL')
      .addOrderBy('RANDOM()')
      .limit(1)
      .getRawOne<{ simplifiedName: string }>();

    if (!word) throw new NotFoundException();

    const answer = word.simplifiedName;

    // 답에 해당하는 단어를 모두 불러옴
    const words = await this.wordRepository.findBy({ simplifiedName: answer });

    const hints: Hint[] = [];

    // 초성 힌트 추가
    hints.push({
      hintType: HintType.Consonants,
      content: hangul
        .disassemble(answer, true)
        .map((c) => c[0])
        .join(''),
    });

    // 글자 수 힌트 추가
    hints.push({
      hintType: HintType.LetterCount,
      count: answer.length,
    });

    for (const word of words) {
      hints.push({
        hintType: HintType.Definition,
        content: word.definition,
      });

      if (word.thumbnail) {
        hints.push({
          hintType: HintType.Image,
          url: word.thumbnail,
        });
      }
    }

    return {
      id: `${QuizType.Word}_`,
      hints,
      quizType: QuizType.Word,
      answer,
      tags: uniq(words.flatMap((w) => w.tags)),
    };
  }
}
