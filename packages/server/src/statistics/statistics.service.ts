import { Injectable } from '@nestjs/common';
import { WordEntity } from 'src/words/word.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { tagStatCache, TagStatItem } from './statistics.cache';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  async getTagStats(useCache = true) {
    if (useCache && tagStatCache.length) return tagStatCache;
    console.log('캐싱 시작');

    const tagsStat = await this.wordRepository
      .createQueryBuilder('word')
      .select('word.tags')
      .addSelect('COUNT(word.tags)', 'count')
      .groupBy('word.tags')
      .getRawMany<{ word_tags: string[]; count: `${number}` }>();

    // 태그의 조합을 분리해서 재계산해야 함
    const tagStats: TagStatItem[] = [];

    for (const tagStat of tagsStat) {
      for (const tag of tagStat.word_tags) {
        if (!tag) continue;

        const tagStatItem = tagStats.find((t) => t.tag === tag);
        if (tagStatItem) {
          tagStatItem.count += parseInt(tagStat.count);
        } else {
          tagStats.push({
            tag,
            count: parseInt(tagStat.count),
          });
        }
      }
    }

    tagStatCache.length = 0;
    tagStatCache.push(...tagStats);

    return tagStats;
  }
}
