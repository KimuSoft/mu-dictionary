import { Injectable, Logger } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch } from 'meilisearch';
import { SyncWordRepository } from '../repositories/sync-word.repository';
import { WordEntity } from '../../words/word.entity';
import { chunk, difference } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

const indexFields: (keyof WordEntity)[] = [
  'id',
  'sourceId',
  'name',
  'simplifiedName',
  'origin',
  'pronunciation',
  'definition',
  'pos',
  'tags',
  'thumbnail',
  'url',
];

@Injectable()
export class SyncWordMeilisearchRepository implements SyncWordRepository {
  private readonly logger = new Logger(SyncWordMeilisearchRepository.name);

  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  public async syncAllWords() {
    this.logger.log('Syncing all words...');

    this.logger.log('Getting all words from DB...');
    const words = await this.wordRepository.find({
      select: indexFields,
    });
    this.logger.log(`Find ${words.length} words...`);

    this.logger.log('Deleting all documents...');
    await this.meilisearch.index('words').deleteAllDocuments();

    this.logger.log('Updating index...');
    await this.updateIndex();

    this.logger.log(`Adding ${words.length} words...`);
    await this.addWordsWithChunk(words);

    this.logger.log('Done.');
    return { inserted: words.length };
  }

  // 특정 referenceId에 해당하는 단어만 동기화
  public async syncRefWords(referenceId: string) {
    this.logger.log(`Syncing words with referenceId: ${referenceId}`);

    this.logger.log('Getting words from DB...');
    const words = await this.wordRepository.find({
      select: indexFields,
      where: { referenceId },
    });

    this.logger.log(`Adding ${words.length} words...`);
    await this.addWordsWithChunk(words);

    this.logger.log('Done.');
    return { inserted: words.length };
  }

  public async syncDiffWords() {
    this.logger.log('Syncing diff words...');

    this.logger.log('Updating index...');
    await this.updateIndex();

    this.logger.log('Getting sourceIds from DB...');
    const dbWords = (
      await this.wordRepository
        .createQueryBuilder('word')
        .select('"sourceId"')
        .getRawMany<{ sourceId: string }>()
    ).map((word) => word.sourceId);
    this.logger.log(`DB Words: ${dbWords.length}`);

    this.logger.log('Getting sourceIds from MeiliSearch...');
    const msWordsRes = await this.meilisearch.index('words').getDocuments({
      offset: 0,
      limit: 100000000,
      fields: ['sourceId'],
    });
    const msWords = msWordsRes.results.map((result) => result.sourceId);
    this.logger.log('MeiliSearch Words:', msWords.length);

    this.logger.log('Calculating diff...');
    const onlyInDB = difference(dbWords, msWords);
    this.logger.log(`Words to insert: ${onlyInDB.length}`);
    const onlyInMS = difference(msWords, dbWords);
    this.logger.log(`Words to delete: ${onlyInMS.length}`);

    const index = this.meilisearch.index('words');

    // Inserting log with count
    if (onlyInDB.length) {
      this.logger.log('Load word from DB...');
      const words = [];
      for (const wordChunk of chunk(onlyInDB, 1000)) {
        const _words = await this.wordRepository.find({
          select: indexFields,
          where: { sourceId: In(wordChunk) },
        });
        words.push(..._words);
      }

      this.logger.log(`Inserting... (total: ${onlyInDB.length})`);
      await this.addWordsWithChunk(words);
    } else {
      this.logger.log('No documents to insert.');
    }

    if (onlyInMS.length) {
      this.logger.log(`Deleting... (total: ${onlyInMS.length})`);
      await index.deleteDocuments(onlyInMS);
    } else {
      this.logger.log('No documents to delete.');
    }

    this.logger.log('Done.');

    return {
      inserted: onlyInDB.length,
      deleted: onlyInMS.length,
    };
  }

  public async syncAllAutocomplete() {
    this.logger.log('Syncing all autocomplete...');
    const simplifiedWords = await this.wordRepository
      .createQueryBuilder('word')
      .select('name')
      .distinct(true)
      .getRawMany<{ name: string }>();

    const autocomplete = this.meilisearch.index('autocomplete');
    await autocomplete.deleteAllDocuments();

    this.logger.log('Adding documents...');
    await this.addAutoCompletesWithChunk(
      simplifiedWords.map((word) =>
        this.convertToAutocompleteEntity(word.name),
      ),
    );

    this.logger.log('Done.');
    return { inserted: simplifiedWords.length };
  }

  async syncDiffAutocomplete() {
    this.logger.log('Syncing diff autocomplete...');

    this.logger.log('Getting Words from DB...');
    const dbWords = (
      await this.wordRepository
        .createQueryBuilder('word')
        .select('name')
        .distinct(true)
        .getRawMany<{ name: string }>()
    ).map((word) => word.name.replace(/[-^]/g, ''));
    this.logger.log(`DB Words: ${dbWords.length}`);

    this.logger.log('Getting Words from MeiliSearch...');
    const msWordsRes = await this.meilisearch
      .index('autocomplete')
      .getDocuments({
        offset: 0,
        limit: 100000000,
        fields: ['name'],
      });
    const msWords: string[] = msWordsRes.results.map((result) => result.name);
    this.logger.log(`MeiliSearch Words: ${msWords.length}`);

    const onlyInDB = difference(dbWords, msWords);
    this.logger.log(`Words to insert: ${onlyInDB.length}`);
    const onlyInMS = difference(msWords, dbWords);
    this.logger.log(`Words to delete: ${onlyInMS.length}`);

    const index = this.meilisearch.index('autocomplete');

    // Inserting log with count
    if (onlyInDB.length) {
      this.logger.log(`Inserting... (total: ${onlyInDB.length})`);
      await this.addAutoCompletesWithChunk(
        onlyInDB.map((word) => this.convertToAutocompleteEntity(word)),
      );
    } else {
      this.logger.log('No documents to insert.');
    }

    if (onlyInMS.length) {
      this.logger.log(`Deleting... (total: ${onlyInMS.length})`);
      const chunked = chunk(onlyInMS, 15000);
      for (const chunk of chunked) {
        await index.deleteDocuments(
          chunk.map((word) => this.toUnicodeId(word)),
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } else {
      this.logger.log('No documents to delete.');
    }

    this.logger.log('Done.');

    return {
      inserted: onlyInDB.length,
      deleted: onlyInMS.length,
    };
  }

  private async updateIndex() {
    await this.meilisearch.updateIndex('words', {
      primaryKey: 'sourceId',
    });
    const index = this.meilisearch.index('words');
    await index.updateFilterableAttributes(['tags']);
  }

  private async addWordsWithChunk(words: WordEntity[]) {
    const index = this.meilisearch.index('words');
    const chunks = chunk(words, 10000);

    // log like 100 / 200 (50%)
    let i = 0;
    const total = chunks.length;

    // for each chunk, add documents
    for (const chunk of chunks) {
      i++;
      this.logger.log(
        `Adding chunk ${i} / ${total} (${Math.round((i / total) * 100)}%)`,
      );
      await index.addDocuments(chunk);
      // 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private convertToAutocompleteEntity(name: string) {
    return {
      id: this.toUnicodeId(name),
      name: name.replace(/[-^]/g, ''),
    };
  }

  private async addAutoCompletesWithChunk(
    autocompletes: {
      id: string;
      name: string;
    }[],
  ) {
    const chunkedWords = chunk(autocompletes, 10000);
    // log like 100 / 200 (50%)
    let i = 0;
    const total = chunkedWords.length;
    const autocomplete = this.meilisearch.index('autocomplete');

    for (const chunk of chunkedWords) {
      i++;
      this.logger.log(
        `Adding chunk ${i} / ${total} (${Math.round((i / total) * 100)}%)`,
      );

      await autocomplete.addDocuments(chunk);

      // 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private toUnicodeId(name: string) {
    // charCodeAt을 이용하여 유니코드로 변환, 글자와 글자 사이는 '-'로 구분
    return name
      .split('')
      .map((char) => char.charCodeAt(0).toString(16))
      .join('-');
  }
}
