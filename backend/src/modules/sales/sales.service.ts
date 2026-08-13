import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateSaleDto } from './dto/create-sale.dto';

import { CashService } from '../cash/cash.service';
import { FinancialService } from '../financial/financial.service';

import {
  CashReferenceType,
} from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly financialService: FinancialService,
) {}

  async create(dto: CreateSaleDto) {
    let total = 0;

    const details: any[] = [];

    if (dto.items.length === 0) {

      throw new BadRequestException(

          "La venta no contiene productos",

      );

    }

    for (const item of dto.items) {
      const product =
        await this.prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          include: {
            prices: true,
          },
        });

        if (item.quantity <= 0) {
            throw new BadRequestException(
            'La cantidad debe ser mayor a cero',
         );
        }

      if (!product) {
        throw new BadRequestException(
          `Producto ${item.productId} no existe`,
        );
      }

      const availablePrices =
        product.prices.sort(

          (a, b) =>

            b.minimumQuantity -

            a.minimumQuantity,

        );

      const selectedPrice =
        availablePrices.find(

          p => item.quantity >= p.minimumQuantity,

        );

      if (!selectedPrice) {

        throw new BadRequestException(

          `El producto ${product.name} no tiene precios configurados`,

        );

      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.name}`,
        );
      }

      const subtotal =
        Number(selectedPrice.price) *
        item.quantity;

      total += subtotal;

      details.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: selectedPrice.price,
        subtotal,
      });
    }

    return this.prisma.$transaction(async (tx) => {

  const sale =
    await tx.sale.create({
      data: {
        userId: dto.userId,
        clientId: dto.clientId,
        paymentMethod: dto.paymentMethod,
        total,

        details: {
          create: details,
        },
      },

      include: {
        details: true,
      },
    });

  for (const item of dto.items) {

    await tx.product.update({
      where: {
        id: item.productId,
      },

      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  await this.financialService.registerProductSale(
  {
    saleId: sale.id,
    amount: Number(sale.total),
    paymentMethod: sale.paymentMethod,
    userId: sale.userId,
  },
  tx,
);

  return sale;
});
  } 

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        details: {
          include: {
            product: true,
          },
        },
        user: true,
      },

      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {

    return this.prisma.sale.findUnique({

        where: {

            id,

        },

        include: {

            user: true,

            details: {

                include: {

                    product: true,

                },

            },

        },

    });

  }
  
}