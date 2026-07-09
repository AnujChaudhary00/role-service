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
import { AssignAccessDto } from './dto/assign-access.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create a role' })
  @ApiCreatedResponse({ description: 'Role created' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @ApiOperation({ summary: 'Get all roles with their resource access' })
  @ApiOkResponse({ description: 'List of roles with nested resources and scopes' })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Get a role by ID with full access details' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a role' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a role (cascades access entries)' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @ApiOperation({ summary: 'Assign a resource+scope to a role' })
  @ApiCreatedResponse({ description: 'Access entry created' })
  @Post(':id/access')
  assignAccess(@Param('id') id: string, @Body() dto: AssignAccessDto) {
    return this.roleService.assignAccess(id, dto);
  }

  @ApiOperation({ summary: 'Get all resource access for a role' })
  @Get(':id/access')
  getAccess(@Param('id') id: string) {
    return this.roleService.getAccess(id);
  }

  @ApiOperation({ summary: 'Update the scope of an access entry' })
  @Patch(':id/access/:accessId')
  updateAccess(
    @Param('id') id: string,
    @Param('accessId') accessId: string,
    @Body() dto: UpdateAccessDto,
  ) {
    return this.roleService.updateAccess(id, accessId, dto);
  }

  @ApiOperation({ summary: 'Remove a resource access from a role' })
  @Delete(':id/access/:accessId')
  removeAccess(@Param('id') id: string, @Param('accessId') accessId: string) {
    return this.roleService.removeAccess(id, accessId);
  }
}
