import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';
import { FindWordDto } from './dto/find-word.dto';
import { FindOneWorkDto } from './dto/find-one-work.dto';
import { SearchLongWordDto } from './dto/search-long-word.dto';

@ApiTags('Words')
@Controller('api/words')
export class WordsController {
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
    return this.wordsService.searchLongWord(dto);
  }
}
