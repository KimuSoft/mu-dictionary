import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PartOfSpeech } from '../types';

@Entity('word')
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sourceId: string;

  // 조건
  // - 한국어가 한 글자 이상 포함될 것
  // - 한국어와 숫자, 단어 구분 구호(-, ^, 띄어쓰기) 만을 허용
  @Column()
  name: string;

  // 한국어와 숫자만을 허용하는 단순화된 단어명
  @Column()
  simplifiedName: string;

  // 단어의 원형
  @Column()
  origin: string;

  @Column({ nullable: true })
  pronunciation?: string;

  @Column()
  definition: string;

  @Column()
  pos: PartOfSpeech;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ nullable: true })
  url?: string;

  // 단어 설명의 출처 URL
  @Column()
  referenceId: string;

  toJSON() {
    return {
      id: this.id,
      sourceId: this.sourceId,
      name: this.name,
      simplifiedName: this.simplifiedName,
      origin: this.origin,
      pronunciation: this.pronunciation,
      definition: this.definition,
      pos: this.pos,
      tags: this.tags,
      thumbnail: this.thumbnail,
      url: this.url,
      referenceId: this.referenceId,
    };
  }
}
