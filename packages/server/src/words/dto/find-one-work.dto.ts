import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class FindOneWorkDto {
  @ApiProperty()
  @IsString()
  id: string;
}
