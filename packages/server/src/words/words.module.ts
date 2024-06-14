import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity])],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
