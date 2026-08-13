import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateServicePriceDto } from './dto/create-service-price.dto';

@Injectable()
export class ServicePricesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateServicePriceDto) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: dto.serviceId,
      },
    });

    if (!service) {
      throw new NotFoundException(
        'Servicio no encontrado',
      );
    }

    const existingPrice =
      await this.prisma.servicePrice.findUnique({
        where: {
          serviceId_isStudent: {
            serviceId: dto.serviceId,
            isStudent: dto.isStudent,
          },
        },
      });

    if (existingPrice) {
      throw new BadRequestException(
        'Ya existe una tarifa para este servicio y tipo de cliente',
      );
    }

    return this.prisma.servicePrice.create({
      data: {
        serviceId: dto.serviceId,
        isStudent: dto.isStudent,
        price: dto.price,
      },
      include: {
        service: true,
      },
    });
  }

  async findAll() {
    return this.prisma.servicePrice.findMany({
      include: {
        service: true,
      },
      orderBy: [
        {
          serviceId: 'asc',
        },
        {
          isStudent: 'desc',
        },
      ],
    });
  }

  async update(
    id: number,
    dto: CreateServicePriceDto,
    ) {
        const existingPrice =
            await this.prisma.servicePrice.findUnique({
                where: {
                id,
            },
        });

    if (!existingPrice) {
        throw new NotFoundException(
            'Tarifa no encontrada',
        );
    }

    const duplicatedPrice =
        await this.prisma.servicePrice.findFirst({
            where: {
                serviceId: dto.serviceId,
                isStudent: dto.isStudent,
                NOT: {
                    id,
                },
            },
        });

    if (duplicatedPrice) {
        throw new BadRequestException(
        'Ya existe otra tarifa para este servicio y tipo de cliente',
        );
    }

    return this.prisma.servicePrice.update({
        where: {
            id,
        },

        data: {
            serviceId: dto.serviceId,
            isStudent: dto.isStudent,
            price: dto.price,
        },

        include: {
            service: true,
        },
        });
    }

    async remove(id: number) {
        const existingPrice =
            await this.prisma.servicePrice.findUnique({
             where: {
                id,
             },
            });

        if (!existingPrice) {
            throw new NotFoundException(
                'Tarifa no encontrada',
            );
        }

        return this.prisma.servicePrice.delete({
            where: {
                id,
            },
        });
    }
}