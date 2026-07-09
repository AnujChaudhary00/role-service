import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'Full system administrator' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
