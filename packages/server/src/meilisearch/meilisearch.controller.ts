import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MeilisearchService } from './meilisearch.service';

@Controller('api/meilisearch')
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  // 임시: Meilisearch 동기화용
  @Post('sync')
  @ApiOperation({
    summary: 'Meilisearch 단어 데이터베이스 색인',
    description: '사용 후 재등록을 위해 1분 정도 검색이 되지 않을 수 있음.',
  })
  async sync() {
    return this.meilisearchService.sync();
  }

  // diffSync
  @Post('diff-sync')
  @ApiOperation({ summary: 'Meilisearch 동기화 (only Insert & Delete)' })
  async diffSync() {
    return this.meilisearchService.diffSync();
  }

  // 임시: Meilisearch 동기화용
  @Post('async')
  @ApiOperation({ summary: 'Meilisearch 자동완성 색인' })
  async autocompleteSync() {
    return this.meilisearchService.autocompleteSync();
  }

  // 임시: Meilisearch stats
  @Get('search/stat')
  async getMeiliSearchStats() {
    return this.meilisearchService.getMeiliSearchStats();
  }

  // 임시: Meilisearch 개요
  @Post('check-tasks')
  @ApiOperation({ summary: 'Meilisearch 작업 확인' })
  async checkTasks() {
    return this.meilisearchService.checkTasks();
  }
}