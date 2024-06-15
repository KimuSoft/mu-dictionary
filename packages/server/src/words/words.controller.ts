import { Controller, Get, Post, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';

@ApiTags('Words')
@Controller('api/words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('search')
  @ApiOperation({ summary: '단어 검색하기 (use Meilisearch)' })
  async search(@Query() searchDto: SearchWordDto) {
    return this.wordsService.search(searchDto);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: '단어 자동완성 (use Meilisearch)' })
  @ApiOkResponse({ type: [String] })
  async autocomplete(
    @Query() autocompleteDto: AutocompleteWordDto,
  ): Promise<string[]> {
    return this.wordsService.autocomplete(autocompleteDto);
  }

  // 임시: Meilisearch 동기화용
  @Post('sync')
  @ApiOperation({
    summary: 'Meilisearch 단어 데이터베이스 색인',
    description: '사용 후 재등록을 위해 1분 정도 검색이 되지 않을 수 있음.',
  })
  async sync() {
    return this.wordsService.sync();
  }

  // diffSync
  @Post('diff-sync')
  @ApiOperation({ summary: 'Meilisearch 동기화 (only Insert & Delete)' })
  async diffSync() {
    return this.wordsService.diffSync();
  }

  // 임시: Meilisearch 동기화용
  @Post('async')
  @ApiOperation({ summary: 'Meilisearch 자동완성 색인' })
  async autocompleteSync() {
    return this.wordsService.autocompleteSync();
  }

  // 임시: Meilisearch stats
  @Get('search/stat')
  async getMeiliSearchStats() {
    return this.wordsService.getMeiliSearchStats();
  }

  // 임시: Meilisearch 개요
  @Post('check-tasks')
  @ApiOperation({ summary: 'Meilisearch 작업 확인' })
  async checkTasks() {
    return this.wordsService.checkTasks();
  }
}
