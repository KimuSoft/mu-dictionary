import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AutocompleteWordDto {
  @ApiProperty({
    description: '검색할 단어',
    example: 'hello',
  })
  @IsString()
  q: string;

  @ApiProperty({
    description: '검색 결과 개수',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;
}
