import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';

import { CashService } from '../cash/cash.service';
import { FinancialService } from '../financial/financial.service';
import { isSameDay } from '../../common/date.util';
import {
  CashReferenceType,
} from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly financialService: FinancialService,
  private readonly cashService: CashService,
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
    if (!dto.payments?.length) {
      throw new BadRequestException('Debe registrar al menos un método de pago');
    }

    const totalPaid = dto.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    if (Math.abs(totalPaid - total) > 0.01) {
      throw new BadRequestException(
        `El total pagado (Bs ${totalPaid}) no coincide con el total de la venta (Bs ${total})`,
      );
    }

    return this.prisma.$transaction(async (tx) => {

  const sale = await tx.sale.create({
    data: {
        userId: dto.userId,
        clientId: dto.clientId,
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

  for (const paymentLine of dto.payments) {

    const salePayment = await tx.salePayment.create({
        data: {
            saleId: sale.id,
            amount: paymentLine.amount,
            paymentMethod: paymentLine.paymentMethod,
            reference: paymentLine.reference,
        },
    });

    await this.financialService.registerProductSale({
        saleId: sale.id,
        amount: Number(salePayment.amount),
        paymentMethod: salePayment.paymentMethod,
        userId: dto.userId,
    }, tx);
  }

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
        where: { id },
        include: {
            user: true,
            details: { include: { product: true } },
            payments: true,
        },
    });
  }

  async cancel(id: number, cancelledById: number, cancelledByRole: string, reason: string) {

    if (!reason?.trim()) {
        throw new BadRequestException('Debe indicar el motivo de la anulación');
    }

    return this.prisma.$transaction(async (tx) => {

        const sale = await tx.sale.findUnique({
            where: { id },
            include: { details: true, payments: true },
        });

        if (!sale) {
            throw new NotFoundException('Venta no encontrada');
        }

        if (sale.status === 'CANCELLED') {
            throw new BadRequestException('Esta venta ya fue anulada');
        }

        if (cancelledByRole !== 'ADMIN') {

            if (sale.userId !== cancelledById) {
                throw new ForbiddenException(
                    'Solo puede anular sus propias ventas, o contactar al administrador',
                );
            }

            if (!isSameDay(sale.saleDate)) {
                throw new ForbiddenException(
                    'Solo puede anular ventas del día de hoy, o contactar al administrador',
                );
            }
        }

        for (const detail of sale.details) {
            await tx.product.update({
                where: { id: detail.productId },
                data: { stock: { increment: detail.quantity } },
            });
        }

        for (const payment of sale.payments) {

            await this.cashService.registerExpense({
                concept: `Anulación Venta #${sale.id} - ${reason}`,
                amount: Number(payment.amount),
                paymentMethod: payment.paymentMethod,
                referenceType: 'PRODUCT_SALE_REVERSAL',
                referenceId: sale.id,
                createdById: cancelledById,
            }, tx);

        }

        return tx.sale.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelReason: reason,
                cancelledById,
                cancelledAt: new Date(),
            },
        });

    });

  }
  
}