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
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

@ApiBearerAuth()
@ApiTags('Resources')
@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiOperation({ summary: 'Create a resource' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  @Post()
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }

  @ApiOperation({ summary: 'Get all resources' })
  @ApiOkResponse({ description: 'List of all resources' })
  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @ApiOperation({ summary: 'Get a resource by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a resource' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.resourceService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a resource' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
