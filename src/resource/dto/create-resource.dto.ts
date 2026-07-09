import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ example: 'users' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'User management resource' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
