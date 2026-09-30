import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';

import { NotFoundException } from '@nestjs/common';
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

  const service = await this.prisma.service.create({
    data: {
      code,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      durationDays: dto.durationDays,
      basePrice: dto.basePrice,
    },
  });

  if (
    dto.studentPrice !== null &&
    dto.studentPrice !== undefined
  ) {

    await this.prisma.servicePrice.create({
      data: {
        serviceId: service.id,
        isStudent: true,
        price: dto.studentPrice,
      },
    });

  }

  

  return this.prisma.service.findUnique({
    where: {
      id: service.id,
    },
    include: {
      servicePrices: true,
    },
  });
}

  async findAll() {

    return this.prisma.service.findMany({

      orderBy: {
        id: 'asc',
      },
      include: {
        servicePrices: true,
      },

    });

  }

  async findOne(id: number) {

    return this.prisma.service.findUnique({

      where: {
        id,
      },
      include: {
        servicePrices: true,
      },

    });

  }

  async update(
    id: number,
    dto: any,
  ) {

    return this.prisma.service.update({

      where: {
        id,
      },

      data: dto,

    });

  }

  async remove(id: number) {

    return this.prisma.service.update({

      where: {
        id,
      },

      data: {
        active: false,
      },

    });

  }

    async toggle(id: number) {

    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        active: !service.active,
      },
    });

  }

}