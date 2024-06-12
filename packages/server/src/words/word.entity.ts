import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PartOfSpeech } from '../types';

@Entity('word')
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  pronunciation: string | null;

  @Column()
  definition: string;

  @Column()
  partOfSpeech: PartOfSpeech;

  @Column()
  tags: string[] = [];

  @Column({ nullable: true })
  thumbnail: string | null;

  @Column({ nullable: true })
  url: string | null;

  // 단어 설명의 출처 URL
  @Column()
  referenceId: string;

  // 단어에서 띄어쓰기, 기호 등을 모두 제거한다.
  simplifyName(): string {
    return this.name.replace(/[^a-zA-Z0-9가-힣]/g, '');
  }
}
