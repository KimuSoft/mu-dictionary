import { Controller, Get, Post, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Words')
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.wordsService.search(query);
  }

  // 임시: Meilisearch 동기화용
  @Post('sync')
  async sync() {
    return this.wordsService.sync();
  }
}
