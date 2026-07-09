import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateScopeDto {
  @ApiProperty({ example: 'read' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'Read-only access' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
