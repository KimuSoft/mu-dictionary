import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Repository } from 'typeorm';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';
import { FindWordDto } from './dto/find-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  async find(dto: FindWordDto): Promise<WordEntity[]> {
    let query = this.wordRepository.createQueryBuilder();

    console.log(dto);
    let filedPrefix = '';

    // fields
    if (dto.fields) {
      if (!Array.isArray(dto.fields)) {
        dto.fields = [dto.fields];
      }
      query = query
        .select(dto.fields.map((f) => 'word.' + f))
        .from(WordEntity, 'word');
      filedPrefix = 'word.';
    }

    // 이름 쿼리
    if (dto.name) {
      if (dto.exact) {
        query = query.andWhere(`${filedPrefix}name = :name`, {
          name: dto.name,
        });
      } else {
        query = query.andWhere(`${filedPrefix}name LIKE :name`, {
          name: `%${dto.name}%`,
        });
      }
    }

    // 단순화된 이름 쿼리
    if (dto.simplifiedName) {
      if (dto.exact) {
        query = query.andWhere(
          `${filedPrefix}simplifiedName = :simplifiedName`,
          {
            simplifiedName: dto.simplifiedName,
          },
        );
      } else {
        query = query.andWhere(
          `${filedPrefix}simplifiedName LIKE :simplifiedName`,
          {
            simplifiedName: `%${dto.simplifiedName}%`,
          },
        );
      }
    }

    // 태그 쿼리
    if (dto.tags) {
      if (!Array.isArray(dto.tags)) {
        query = query.andWhere(`:tag = ANY("${filedPrefix}tags")`, {
          tag: dto.tags,
        });
      } else {
        query = query.andWhere(`"${filedPrefix}tags" && :tags`, {
          tags: dto.tags,
        });
      }
    }

    // 품사 쿼리
    if (dto.pos) {
      if (!Array.isArray(dto.pos)) {
        query = query.andWhere(`"${filedPrefix}pos" = :pos`, { pos: dto.pos });
      } else {
        query = query.andWhere(`${filedPrefix}pos" = ANY(:pos)`, {
          pos: dto.pos,
        });
      }
    }

    return query.offset(dto.offset).limit(dto.limit).getMany();
  }

  async findOneById(id: string) {
    return this.wordRepository.findOneBy({ id });
  }

  // async find() {
  //   return this.wordRepository.find();
  // }

  async search({ q: query, limit, offset }: SearchWordDto) {
    return this.meilisearch.index('words').search(query, {
      limit,
      offset,
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
}
