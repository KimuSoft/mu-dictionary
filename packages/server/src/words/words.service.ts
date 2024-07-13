import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Like, Repository, SelectQueryBuilder } from 'typeorm';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';
import { FindWordDto } from './dto/find-word.dto';
import { SearchLongWordDto } from './dto/search-long-word.dto';
import { uniq } from 'lodash';
import { FindMode } from 'mudict-api-types';

@Injectable()
export class WordsService {
  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  addModeWhere(
    mode: FindMode,
    query: SelectQueryBuilder<WordEntity>,
    field: string,
    keyword: string,
  ) {
    switch (mode) {
      case FindMode.Exact:
        return query.andWhere(`"${field}" = :${field}`, { [field]: keyword });
      case FindMode.Include:
        return query.andWhere(`"${field}" LIKE :${field}`, {
          [field]: `%${keyword}%`,
        });
      case FindMode.Like:
        return query.andWhere(`"${field}" LIKE :${field}`, {
          [field]: keyword,
        });
      case FindMode.Regex:
        return query.andWhere(`"${field}" ~ :${field}`, { [field]: keyword });
    }
  }

  async find(dto: FindWordDto): Promise<WordEntity[]> {
    let query = this.wordRepository.createQueryBuilder();

    // 이름 쿼리
    if (dto.name) {
      query = this.addModeWhere(dto.mode, query, 'name', dto.name);
    }

    // 단순화된 이름 쿼리
    if (dto.simplifiedName) {
      query = this.addModeWhere(
        dto.mode,
        query,
        'simplifiedName',
        dto.simplifiedName,
      );
    }

    // 태그 쿼리
    if (dto.tags) {
      if (!Array.isArray(dto.tags)) {
        query = query.andWhere(`:tag = ANY("tags")`, {
          tag: dto.tags,
        });
      } else {
        query = query.andWhere(`tags" && :tags`, {
          tags: dto.tags,
        });
      }
    }

    // 품사 쿼리
    if (dto.pos !== undefined) {
      if (!Array.isArray(dto.pos)) {
        query = query.andWhere(`pos" = :pos`, { pos: dto.pos });
      } else {
        query = query.andWhere(`pos" = ANY(:pos)`, {
          pos: dto.pos,
        });
      }
    }

    // 정렬 쿼리
    query = query.orderBy(
      dto.sort === 'length' ? `LENGTH("simplifiedName")` : dto.sort,
      dto.order,
    );

    query = query.offset(dto.offset).limit(dto.limit);
    console.debug(query.getQuery());

    return query.getMany();
  }

  async findOneById(id: string) {
    return this.wordRepository.findOneBy({ sourceId: id });
  }

  async search({ q: query, limit, offset, tags }: SearchWordDto) {
    return this.meilisearch.index('words').search(query, {
      limit,
      offset,
      ...(tags.length && {
        filter: [`tags IN [${tags.map((t) => `"${t}"`).join(',')}]`],
      }),
    });
  }

  async autocomplete({ q: query, limit }: AutocompleteWordDto) {
    const result = await this.meilisearch
      .index('autocomplete')
      .search<{ name: string }>(query, {
        limit,
      });

    return result.hits.map((hit) => hit.name);
  }

  async searchLongWord(dto: SearchLongWordDto) {
    console.info('loading long words', dto);
    let query = this.wordRepository
      .createQueryBuilder('word')
      .select('word.simplifiedName', 'simplifiedName')
      .addSelect('LENGTH(word.simplifiedName)', 'length');

    if (dto.letter) {
      query = query.where({ simplifiedName: Like(`${dto.letter}%`) });
    }

    const results = await query
      .groupBy('word.simplifiedName')
      .orderBy('length', 'DESC')
      .limit(dto.limit)
      .offset(dto.offset)
      .getRawMany<{
        length: number;
        simplifiedName: string;
        tags?: string[];
        ids?: string[];
      }>();

    // 각 단어의 태그를 가져옴
    for (const result of results) {
      const words = await this.wordRepository.find({
        select: ['id', 'tags'],
        where: { simplifiedName: result.simplifiedName },
      });
      result.tags = uniq(words.map((word) => word.tags).flat());
      result.ids = words.map((word) => word.sourceId);
    }

    return results;
  }
}
