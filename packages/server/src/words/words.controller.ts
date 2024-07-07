import { Controller, Get, Param, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';
import { FindWordDto } from './dto/find-word.dto';
import { FindOneWorkDto } from './dto/find-one-work.dto';
import { SearchLongWordDto } from './dto/search-long-word.dto';

@ApiTags('Words')
@Controller('api/words')
export class WordsController {
  defaultLongWordCache: any[] | null = null;
  cacheExpireTime: Date | null = null;
  // 하루
  expiredTime = 86400000;

  constructor(private readonly wordsService: WordsService) {}

  @Get()
  @ApiOperation({ summary: '단어 목록 조회' })
  async find(@Query() dto: FindWordDto) {
    return this.wordsService.find(dto);
  }

  @Get('stat')
  @ApiOperation({ summary: '단어 출처 현황' })
  async stat() {
    return this.wordsService.stat();
  }

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

  @Get(':id')
  @ApiOperation({ summary: '단어 상세 조회' })
  async findOneById(@Param() { id }: FindOneWorkDto) {
    return this.wordsService.findOneById(id);
  }

  @Get('search/long-word')
  @ApiOperation({ summary: '긴 단어 검색하기' })
  async findLongWord(@Query() dto: SearchLongWordDto) {
    if (!dto.letter && dto.useCache) {
      // 사용 기한 전인 캐시가 있는지 확인
      if (
        this.defaultLongWordCache &&
        this.cacheExpireTime &&
        this.cacheExpireTime > new Date()
      ) {
        return this.defaultLongWordCache.slice(
          dto.offset,
          dto.offset + dto.limit,
        );
      }

      const res = await this.wordsService.searchLongWord({
        ...dto,
        offset: 0,
        limit: 100,
      });
      this.defaultLongWordCache = res;
      // 10분 뒤를 지정함
      this.cacheExpireTime = new Date(Date.now() + this.expiredTime);
      return res.slice(dto.offset, dto.offset + dto.limit);
    }

    return this.wordsService.searchLongWord(dto);
  }
}
