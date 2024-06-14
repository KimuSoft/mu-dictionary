import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch, TasksResults } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Repository } from 'typeorm';
import { SearchWordDto } from './dto/search-word.dto';
import { AutocompleteWordDto } from './dto/autocomplete-word.dto';
import { chunk } from 'lodash';

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

  async getMeiliSearchStats() {
    return this.meilisearch.getStats();
  }

  async checkTasks() {
    // check if there are any tasks
    const tasks: TasksResults = await this.meilisearch.getTasks();
    console.info(`Tasks: ${tasks.total}`);

    return tasks;
  }

  async sync() {
    console.info('Syncing words...');
    const words = await this.wordRepository.find();
    await this.meilisearch.createIndex('words', {
      primaryKey: 'id',
    });
    const index = this.meilisearch.index('words');
    await index.deleteAllDocuments();

    // chunk words into 1000 words (with lodash)
    const chunks = chunk(words, 10000);

    // log like 100 / 200 (50%)
    let i = 0;
    const total = chunks.length;
    console.info(`Adding ${words.length} words...`);

    // for each chunk, add documents
    for (const chunk of chunks) {
      i++;
      console.info(
        `Adding chunk ${i} / ${total} (${Math.round((i / total) * 100)}%)`,
      );
      await index.addDocuments(chunk.map((word) => word.toJSON()));
      // 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.info('Done.');
  }

  async autocompleteSync() {
    // autocomplete index
    console.info('Syncing autocomplete...');
    const simplifiedWords = await this.wordRepository
      .createQueryBuilder('word')
      .select('name')
      .distinct(true)
      .getRawMany<{ name: string }>();

    console.log(simplifiedWords[0]);

    const autocomplete = this.meilisearch.index('autocomplete');
    await autocomplete.deleteAllDocuments();

    console.info('Adding documents...');
    const chunkedWords = chunk(simplifiedWords, 5000);
    // log like 100 / 200 (50%)
    let i = 0;
    const total = chunkedWords.length;

    for (const chunk of chunkedWords) {
      i++;
      console.info(
        `Adding chunk ${i} / ${total} (${Math.round((i / total) * 100)}%)`,
      );

      await autocomplete.addDocuments(
        chunk.map((word, idx) => ({
          id: i * 5000 + idx,
          name: word.name,
        })),
      );

      // 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.info('Done.');
  }
}
