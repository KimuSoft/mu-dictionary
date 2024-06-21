import { Module } from '@nestjs/common';
import { MeilisearchController } from './meilisearch.controller';
import { MeilisearchService } from './meilisearch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from '../words/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity])],
  controllers: [MeilisearchController],
  providers: [MeilisearchService],
})
export class MeilisearchModule {}
