import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  FindMode,
  FindWordsRequestQuery,
  PartOfSpeech,
  SortableWordField,
} from 'mudict-api-types';

export class FindWordDto implements FindWordsRequestQuery {
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

  @ApiProperty({
    description: '검색할 태그 조건 (or)',
    required: false,
    type: [String],
  })
  @IsString({ each: true })
  @IsOptional()
  tags?: string | string[];

  @ApiProperty({
    description: '검색할 품사 조건 (or)',
    required: false,
    type: [String],
  })
  @IsEnum(PartOfSpeech, { each: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pos?: PartOfSpeech | PartOfSpeech[];

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
    description: '검색 모드',
    required: false,
    example: FindMode.Include,
    default: FindMode.Include,
    enum: FindMode,
  })
  @IsEnum(FindMode)
  @IsOptional()
  @Transform(({ value }) => value.toString().toLowerCase())
  mode: FindMode = FindMode.Include;

  @ApiProperty({
    description: '검색 결과 정렬 조건',
    required: false,
    example: 'id',
    default: 'id',
  })
  @IsEnum(['id', 'sourceId', 'name', 'length'])
  @IsOptional()
  sort: SortableWordField = SortableWordField.Id;

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
