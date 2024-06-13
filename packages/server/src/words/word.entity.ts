import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PartOfSpeech } from '../types';

@Entity('word')
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  pronunciation: string | null;

  @Column()
  definition: string;

  @Column()
  pos: PartOfSpeech;

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
