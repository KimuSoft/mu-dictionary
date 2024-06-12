import { Module } from '@nestjs/common';
import { WordsModule } from './words/words.module';
import { MeiliSearchModule } from 'nestjs-meilisearch';

@Module({
  imports: [
    MeiliSearchModule.forRoot({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_API_KEY || 'masterKey',
    }),
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
