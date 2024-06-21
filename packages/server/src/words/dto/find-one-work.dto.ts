import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneWorkDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
