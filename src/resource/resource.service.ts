import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateResourceDto) {
    try {
      return await this.prisma.resource.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Resource "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.resource.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException(`Resource ${id} not found`);
    return resource;
  }

  async update(id: string, dto: UpdateResourceDto) {
    await this.findOne(id);
    try {
      return await this.prisma.resource.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Resource "${dto.name}" already exists`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.resource.delete({ where: { id } });
  }
}
