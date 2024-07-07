import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('api/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // 태그 목록과 갯수 조회
  @Get('tags')
  async getTagStats(@Query('cache') useCache: boolean) {
    return this.statisticsService.getTagStats(useCache);
  }
}
