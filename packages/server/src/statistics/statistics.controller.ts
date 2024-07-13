import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('api/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('tags')
  @ApiOperation({ summary: '태그 목록과 갯수 조회' })
  async getTagStats(@Query('cache') useCache: boolean) {
    return this.statisticsService.getTagStats(useCache);
  }

  @Get('initials')
  @ApiOperation({ summary: '모든 시작 글자 목록과 갯수 조회' })
  async getInitialStats() {
    return this.statisticsService.getInitialStats();
  }

  @Get('stat')
  @ApiOperation({ summary: '단어 출처 현황' })
  async stat() {
    return this.statisticsService.getReferenceStats();
  }
}
