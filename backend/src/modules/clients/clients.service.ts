import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateClientDto) {

  return this.prisma.client.create({

    data: {

      ...dto,

      birthDate: dto.birthDate
        ? new Date(dto.birthDate)
        : undefined,

      },

  });

}

  async update(id: number, dto: CreateClientDto) {

  return this.prisma.client.update({

    where: {
      id,
    },

    data: {

      ...dto,

      birthDate: dto.birthDate
        ? new Date(dto.birthDate)
        : undefined,

    },

  });

}

async remove(id: number) {
  return this.prisma.client.update({
    where: {
      id,
    },

    data: {
      active: false,
    }
    
  });
}

async findAll(search?: string) {
  return this.prisma.client.findMany({
    where: {
      active: true,
      ...(search && {
        OR: [
          {
            fullName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            ci: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search,
            },
          },
        ],
      }),
    },
    orderBy: {
      fullName: 'asc',
    },
  });
}

  async findOne(id: number) {
    return this.prisma.client.findUnique({
      where: {
        id,
      },
    });
  }
}