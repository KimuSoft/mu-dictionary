import { Module } from '@nestjs/common';
import { WordsModule } from './words/words.module';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { QuizModule } from './quiz/quiz.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    MeiliSearchModule.forRoot({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_API_KEY || 'masterKey',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'client', 'dist'),
    // }),
    WordsModule,
    MeilisearchModule,
    StatisticsModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
