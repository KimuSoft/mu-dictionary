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
}
