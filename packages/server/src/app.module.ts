import { Module } from '@nestjs/common';
import { WordsModule } from './words/words.module';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MeilisearchModule } from './meilisearch/meilisearch.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
    }),
    WordsModule,
    MeilisearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
