import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        durationDays: dto.durationDays,
      },
    });
  }

  async findAll() {

    return this.prisma.promotion.findMany({

      orderBy: {
        id: 'asc',
      },

    });

  }

  async update(
    id: number,
    dto: CreatePromotionDto,
  ) {

    return this.prisma.promotion.update({

      where: {
        id,
      },

      data: {

        name: dto.name,

        description: dto.description,

        price: dto.price,

        startDate: new Date(dto.startDate),

        endDate: new Date(dto.endDate),

        active: dto.active,

      },

    });

  }

  async toggleActive(id: number) {

    const promotion =
      await this.prisma.promotion.findUnique({
        where: {
          id,
        },
      });

    if (!promotion) {
      throw new Error('Promoción no encontrada');
    }

    return this.prisma.promotion.update({

      where: {
        id,
      },

      data: {
        active: !promotion.active,
      },

    });

  }

}