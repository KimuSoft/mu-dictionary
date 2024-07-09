import { Module } from '@nestjs/common';
import { MeilisearchController } from './meilisearch.controller';
import { MeilisearchService } from './meilisearch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from '../words/word.entity';
import { SYNC_WORD_REPOSITORY } from './repositories/sync-word.repository';
import { SyncWordMeilisearchRepository } from './implements/sync-word-meilisearch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity])],
  controllers: [MeilisearchController],
  providers: [
    MeilisearchService,
    {
      provide: SYNC_WORD_REPOSITORY,
      useValue: SyncWordMeilisearchRepository,
    },
  ],
})
export class MeilisearchModule {}
