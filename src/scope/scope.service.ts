import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { UpdateScopeDto } from './dto/update-scope.dto';

@Injectable()
export class ScopeService {
  private readonly logger = new Logger(ScopeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateScopeDto) {
    try {
      return await this.prisma.scope.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Scope "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.scope.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const scope = await this.prisma.scope.findUnique({ where: { id } });
    if (!scope) throw new NotFoundException(`Scope ${id} not found`);
    return scope;
  }

  async update(id: string, dto: UpdateScopeDto) {
    await this.findOne(id);
    try {
      return await this.prisma.scope.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Scope "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.scope.delete({ where: { id } });
  }
}
