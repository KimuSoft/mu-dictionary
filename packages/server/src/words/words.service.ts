import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Repository } from 'typeorm';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

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

  async sync() {
    console.info('Syncing words...');
    const words = await this.wordRepository.find();
    const index = this.meilisearch.index('words');
    await index.deleteAllDocuments();

    console.info(`Adding ${words.length} words...`);
    await index.addDocuments(words.map((word) => word.toJSON()));

    console.info('Done.');
  }

  async autocompleteSync() {
    // autocomplete index
    console.info('Syncing autocomplete...');
    const simplifiedWords = await this.wordRepository
      .createQueryBuilder('word')
      .select('name')
      .distinct(true)
      .getRawMany();

    console.log(simplifiedWords[0]);

    const autocomplete = this.meilisearch.index('autocomplete');
    await autocomplete.deleteAllDocuments();
    await autocomplete.addDocuments(
      simplifiedWords.map((word, i) => ({
        id: i,
        name: word.name,
      })),
    );
    console.info('Done.');
  }
}
