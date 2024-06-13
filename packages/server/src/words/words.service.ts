import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { Meilisearch } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Repository } from 'typeorm';

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

  async search(query: string) {
    return this.meilisearch.index('words').search(query);
  }

  async sync() {
    console.info('Syncing words...');
    const words = await this.wordRepository.find();
    const index = this.meilisearch.index('words');
    await index.deleteAllDocuments();
    await index.addDocuments(words);

    // autocomplete index
    // simplifedName을 중복 제거하고 array로 받아옴
    const simplifiedWords = await this.wordRepository
      .createQueryBuilder('words')
      .select('ARRAY_AGG(DISTINCT simplifiedName)', 'simplifiedName')
      .getRawOne();

    const autocomplete = this.meilisearch.index('autocomplete');
    await autocomplete.deleteAllDocuments();
    await autocomplete.addDocuments(simplifiedWords.simplifiedName);
  }
}
