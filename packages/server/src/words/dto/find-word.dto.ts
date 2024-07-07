import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartOfSpeech } from 'mudict-api-types';

export enum WordFields {
  Id = 'id',
  Name = 'name',
  SimplifiedName = 'simplifiedName',
  Origin = 'origin',
  Pronunciation = 'pronunciation',
  Definition = 'definition',
  Pos = 'pos',
  Tags = 'tags',
  Thumbnail = 'thumbnail',
  Url = 'url',
  ReferenceId = 'referenceId',
}

export class FindWordDto {
  @ApiProperty({
    description: '단어 이름',
    example: '사과',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: '단순화된 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  simplifiedName?: string;

  // 얻어올 필드
  @ApiProperty({
    description: '얻어올 필드',
    required: false,
  })
  @IsEnum(WordFields, { each: true })
  @IsOptional()
  fields?: string[];

  @ApiProperty({
    description: '검색할 태그 조건 (or)',
    required: false,
    type: [String],
  })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] | string;

  @ApiProperty({
    description: '검색할 품사 조건 (or)',
    required: false,
    type: [String],
  })
  @IsEnum(PartOfSpeech, { each: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pos?: PartOfSpeech[] | PartOfSpeech;

  @ApiProperty({
    description: '개수',
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @ApiProperty({
    description: '시작 위치',
    example: 0,
    default: 0,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  offset: number = 0;

  @ApiProperty({
    description: '정확한 이름 검색',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  exact: boolean = false;

  @ApiProperty({
    description: '검색 결과 정렬 조건',
    required: false,
    example: 'id',
    default: 'id',
  })
  @IsEnum(['id', 'sourceId', 'name', 'length'])
  @IsOptional()
  sort: string = 'id';

  @ApiProperty({
    description: '검색 결과 정렬 순서',
    example: 'asc',
    default: 'asc',
    required: false,
  })
  @IsEnum(['ASC', 'DESC'])
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  order: 'ASC' | 'DESC' = 'ASC';
}
