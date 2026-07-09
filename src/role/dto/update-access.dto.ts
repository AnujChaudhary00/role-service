import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateAccessDto {
  @ApiProperty({ example: 'uuid-of-scope' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  scopeId!: string;
}
