import { Inject, Injectable } from '@nestjs/common';
import { Meilisearch } from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import {
  SYNC_WORD_REPOSITORY,
  SyncWordRepository,
} from './repositories/sync-word.repository';

@Injectable()
export class MeilisearchService {
  constructor(
    @InjectMeiliSearch()
    private readonly meilisearch: Meilisearch,
    @Inject(SYNC_WORD_REPOSITORY)
    private readonly syncWordRepository: SyncWordRepository,
  ) {}

  public async getMeilisearchStats() {
    return this.meilisearch.getStats();
  }

  public async checkMeilisearchTasks() {
    return this.meilisearch.getTasks();
  }

  public async syncWords(referenceId?: string) {
    if (referenceId) {
      return this.syncWordRepository.syncRefWords(referenceId);
    } else {
      return this.syncWordRepository.syncAllWords();
    }
  }

  public async diffSync() {
    return this.syncWordRepository.syncDiffWords();
  }

  public async autocompleteSync(reset?: boolean) {
    if (reset) {
      return this.syncWordRepository.syncAllAutocomplete();
    } else {
      return this.syncWordRepository.syncDiffAutocomplete();
    }
  }
}
