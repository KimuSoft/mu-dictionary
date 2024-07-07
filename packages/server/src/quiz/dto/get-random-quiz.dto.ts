import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRandomQuizDto {
  @ApiProperty({
    title: '태그 (or) 조건',
    required: false,
  })
  @IsString({ each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  tags: string[] = [];

  @ApiProperty({
    title: '제외할 id 목록',
    required: false,
  })
  @IsString({ each: true })
  @Transform(({ value }) =>
    value && typeof value === 'string' ? [value] : value,
  )
  exclude: string[] = [];
}
