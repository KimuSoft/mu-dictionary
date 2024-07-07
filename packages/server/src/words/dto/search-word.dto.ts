import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchWordDto {
  @ApiProperty({
    description: '검색할 단어',
    example: '사과',
  })
  q: string;

  @ApiProperty({
    description: '태그 필터링',
    example: ['건설', '경영'],
    required: false,
  })
  @IsString({ each: true })
  @Transform(({ value }) => (value && typeof value === 'string' ? [value] : value))
  tags?: string[];

  @ApiProperty({
    description: '검색 결과 개수',
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @ApiProperty({
    description: '검색 결과 시작 위치',
    example: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset: number = 0;
}
