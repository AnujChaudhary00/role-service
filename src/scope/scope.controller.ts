import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateScopeDto } from './dto/create-scope.dto';
import { UpdateScopeDto } from './dto/update-scope.dto';
import { ScopeService } from './scope.service';

@ApiBearerAuth()
@ApiTags('Scopes')
@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('scopes')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @ApiOperation({ summary: 'Create a scope' })
  @ApiCreatedResponse({ description: 'Scope created' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  @Post()
  create(@Body() dto: CreateScopeDto) {
    return this.scopeService.create(dto);
  }

  @ApiOperation({ summary: 'Get all scopes' })
  @ApiOkResponse({ description: 'List of all scopes' })
  @Get()
  findAll() {
    return this.scopeService.findAll();
  }

  @ApiOperation({ summary: 'Get a scope by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scopeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a scope' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScopeDto) {
    return this.scopeService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a scope' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scopeService.remove(id);
  }
}
