import { Injectable } from '@nestjs/common';
import { Meilisearch, TasksResults } from 'meilisearch';
import { chunk, difference } from 'lodash';
import { In, Repository } from 'typeorm';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from '../words/word.entity';

@Injectable()
export class MeilisearchService {
  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  async getMeiliSearchStats() {
    return this.meilisearch.getStats();
  }

  async checkTasks() {
    // check if there are any tasks
    const tasks: TasksResults = await this.meilisearch.getTasks();
    console.info(`Tasks: ${tasks.total}`);

    return tasks;
  }

  async diffSync() {
    // DB에서 sourceId만 가져옴
    console.info('Syncing words...');

    console.info('Updating index...');
    await this.meilisearch.updateIndex('words', {
      primaryKey: 'sourceId',
    });

    console.info('Getting sourceIds from DB...');
    const dbWords = (
      await this.wordRepository
        .createQueryBuilder('word')
        .select('"sourceId"')
        .getRawMany<{ sourceId: string }>()
    ).map((word) => word.sourceId);
    console.info('DB Words:', dbWords.length);

    console.info('Getting sourceIds from MeiliSearch...');
    // MeiliSearch에서 sourceId만 가져옴
    const msWordsRes = await this.meilisearch.index('words').getDocuments({
      offset: 0,
      limit: 100000000,
      fields: ['sourceId'],
    });

    console.log(msWordsRes);

    const msWords = msWordsRes.results.map((result) => result.sourceId);
    console.info('MeiliSearch Words:', msWords.length);

    console.info('Calculating diff (to insert)...');
    const onlyInDB = difference(dbWords, msWords);
    console.info('Only in DB:', onlyInDB.length);

    console.info('Calculating diff (to delete)...');
    const onlyInMS = difference(msWords, dbWords);
    console.info('Only in MeiliSearch:', onlyInMS.length);

    const index = this.meilisearch.index('words');

    // Inserting log with count
    if (onlyInDB.length) {
      console.info('Load word from DB...');
      const words = [];
      for (const wordChunk of chunk(onlyInDB, 1000)) {
        const _words = await this.wordRepository.findBy({
          sourceId: In(wordChunk),
        });
        words.push(..._words);
      }

      console.info(`Inserting... (total: ${onlyInDB.length})`);
      await index.addDocuments(words.map((word) => word.toJSON()));
    } else {
      console.info('No documents to insert.');
    }

    if (onlyInMS.length) {
      console.info(`Deleting... (total: ${onlyInMS.length})`);
      await index.deleteDocuments(onlyInMS);
    } else {
      console.info('No documents to delete.');
    }

    console.info('Done.');
  }

  async sync() {
    console.info('Syncing words...');
    const words = await this.wordRepository.find();
    const index = this.meilisearch.index('words');
    await index.deleteAllDocuments();

    console.info('Updating index...');
    await this.meilisearch.updateIndex('words', {
      primaryKey: 'sourceId',
    });

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
    const chunkedWords = chunk(simplifiedWords, 10000);
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
          name: word.name.replace(/[-^]/g, ''),
        })),
      );

      // 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.info('Done.');
  }
}