import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignAccessDto {
  @ApiProperty({ example: 'uuid-of-resource' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  resourceId!: string;

  @ApiProperty({ example: 'uuid-of-scope' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  scopeId!: string;
}
