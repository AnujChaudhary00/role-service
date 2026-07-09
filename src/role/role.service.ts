import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AssignAccessDto } from './dto/assign-access.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const ACCESS_INCLUDE = { resource: true, scope: true } as const;

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Role "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: { roleAccess: { include: ACCESS_INCLUDE } },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { roleAccess: { include: ACCESS_INCLUDE } },
    });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);
    try {
      return await this.prisma.role.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Role "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.role.delete({ where: { id } });
  }

  async assignAccess(roleId: string, dto: AssignAccessDto) {
    await this.findOne(roleId);
    try {
      return await this.prisma.roleResourceAccess.create({
        data: { roleId, resourceId: dto.resourceId, scopeId: dto.scopeId },
        include: ACCESS_INCLUDE,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('This resource+scope is already assigned to the role');
        if (e.code === 'P2003') throw new BadRequestException('Invalid resourceId or scopeId');
      }
      throw e;
    }
  }

  getAccess(roleId: string) {
    return this.prisma.roleResourceAccess.findMany({
      where: { roleId },
      include: ACCESS_INCLUDE,
    });
  }

  async updateAccess(roleId: string, accessId: string, dto: UpdateAccessDto) {
    const entry = await this.prisma.roleResourceAccess.findFirst({
      where: { id: accessId, roleId },
    });
    if (!entry) throw new NotFoundException(`Access entry ${accessId} not found on role ${roleId}`);
    try {
      return await this.prisma.roleResourceAccess.update({
        where: { id: accessId },
        data: { scopeId: dto.scopeId },
        include: ACCESS_INCLUDE,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('This resource+scope combination already exists');
        if (e.code === 'P2003') throw new BadRequestException('Invalid scopeId');
      }
      throw e;
    }
  }

  async removeAccess(roleId: string, accessId: string) {
    const entry = await this.prisma.roleResourceAccess.findFirst({
      where: { id: accessId, roleId },
    });
    if (!entry) throw new NotFoundException(`Access entry ${accessId} not found on role ${roleId}`);
    return this.prisma.roleResourceAccess.delete({ where: { id: accessId } });
  }
}
