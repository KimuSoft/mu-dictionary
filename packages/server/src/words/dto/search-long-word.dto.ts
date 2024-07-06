import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchLongWordDto {
  @ApiProperty({
    description: '시작 글자',
    example: '가',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 1)
  @Transform(({ value }) => (value.trim() === '' ? undefined : value))
  letter?: string;

  @ApiProperty({
    description: '검색 결과 개수',
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
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
