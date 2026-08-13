import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: dto,
    });
  }

  async findAll() {

    return this.prisma.supplier.findMany({

      where: {

        isActive: true,

      },

      include: {

       _count: {

          select: {

            purchases: true,

          },

        },

      },

      orderBy: {

        name: "asc",

      },

    });

  }

  async findOne(id: number) {
    return this.prisma.supplier.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateSupplierDto,
  ) {

    return this.prisma.supplier.update({

        where: {
            id,
        },

        data: dto,

    });

  }
  
  async toggleStatus(id: number) {

    const supplier =
        await this.prisma.supplier.findUnique({

            where: {
                id,
            },

        });

    if (!supplier) {

        throw new Error(
            "Proveedor no encontrado",
        );

    }

    return this.prisma.supplier.update({

        where: {
            id,
        },

        data: {

            isActive:
                !supplier.isActive,

        },

    });

  }

  async getDetail(id: number) {

    const supplier =
        await this.prisma.supplier.findUnique({

            where: {
                id,
            },

            include: {

                purchases: {

                    include: {

                        details: true,

                    },

                    orderBy: {

                        purchaseDate: "desc",

                    },

                },

            },

        });

    if (!supplier) {

        throw new Error(
            "Proveedor no encontrado",
        );

    }

    const totalPurchases =
        supplier.purchases.length;

    const totalAmount =
        supplier.purchases.reduce(

            (sum, p) =>

                sum + Number(p.total),

            0,

        );

    const averagePurchase =

      totalPurchases === 0

        ? 0

        : totalAmount / totalPurchases;

    const lastPurchase =

        supplier.purchases[0] ?? null;

    return {

        ...supplier,

        statistics: {

            totalPurchases,

            totalAmount,

            lastPurchase,

        },

    };

  }

  async search(term: string) {

  return this.prisma.supplier.findMany({

    where: {

      isActive: true,

      name: {

        contains: term,

        mode: "insensitive",

      },

    },

    orderBy: {

      name: "asc",

    },

  });

  }
}