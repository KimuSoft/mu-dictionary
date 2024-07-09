import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MeilisearchService } from './meilisearch.service';

@ApiTags('Meilisearch')
@Controller('api/meilisearch')
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Meilisearch 단어 데이터베이스 색인',
    description: '사용 후 재등록을 위해 1분 정도 검색이 되지 않을 수 있음.',
  })
  async sync(@Query('ref') ref?: string) {
    return this.meilisearchService.syncWords(ref);
  }

  @Post('diff-sync')
  @ApiOperation({ summary: 'Meilisearch 동기화 (only Insert & Delete)' })
  async diffSync() {
    return this.meilisearchService.diffSync();
  }

  @Post('autocomplete/sync')
  @ApiOperation({ summary: 'Meilisearch 자동완성 색인 (전체)' })
  async autocompleteSync(@Query('reset') reset?: boolean) {
    return this.meilisearchService.autocompleteSync(reset);
  }

  @Get('stat')
  async getMeiliSearchStats() {
    return this.meilisearchService.getMeilisearchStats();
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Meilisearch 작업 확인' })
  async checkTasks() {
    return this.meilisearchService.checkMeilisearchTasks();
  }
}
