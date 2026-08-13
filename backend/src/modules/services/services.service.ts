import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateServiceDto) {

    const code = dto.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase();
    return this.prisma.service.create({
      data: {
        code,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        durationDays: dto.durationDays,
        basePrice: dto.basePrice,
      },
    });
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {

    return this.prisma.service.findUnique({

      where: { id },

    });

  }

  async update(
    id: number,
    dto: any,
  ) {

    return this.prisma.service.update({

      where: { id },

      data: dto,

    });

  }

  async remove(id: number) {

    return this.prisma.service.update({

      where: { id },

      data: {

        active: false,

      },

    });

  }
}