import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreatePurchaseDto } from './dto/create-purchase.dto';

import { FinancialService } from '../financial/financial.service';

@Injectable()
export class PurchasesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly financialService: FinancialService,
  ) {}

  async create(
    dto: CreatePurchaseDto,
    createdById: number,
  ) {

    return this.prisma.$transaction(async (tx) => {

      // -----------------------------------------
      // 1. Validar proveedor
      // -----------------------------------------

      const supplier =
        await tx.supplier.findUnique({
          where: {
            id: dto.supplierId,
          },
        });

      if (!supplier) {
        throw new NotFoundException(
          'Proveedor no encontrado',
        );
      }


      // -----------------------------------------
      // 2. Validar detalles
      // -----------------------------------------

      if (!dto.details?.length) {
        throw new BadRequestException(
          'La compra debe contener al menos un producto',
        );
      }


      // -----------------------------------------
      // 3. Validar productos y calcular total
      // -----------------------------------------

      let total = 0;

      for (const item of dto.details) {

        const product =
          await tx.product.findUnique({
            where: {
              id: item.productId,
            },
          });

        if (!product) {
          throw new NotFoundException(
            `Producto ${item.productId} no encontrado`,
          );
        }

        if (item.quantity <= 0) {
          throw new BadRequestException(
            'La cantidad debe ser mayor a cero',
          );
        }

        if (item.unitCost <= 0) {
          throw new BadRequestException(
            'El costo unitario debe ser mayor a cero',
          );
        }

        total +=
          item.quantity *
          item.unitCost;
      }


      // -----------------------------------------
      // 4. Crear compra
      // -----------------------------------------

      const purchase =
        await tx.purchase.create({

          data: {

            supplierId:
              dto.supplierId,

            paymentMethod:
              dto.paymentMethod,

            invoiceNumber:
              dto.invoiceNumber,

            notes:
              dto.notes,

            total,

            createdById,
          },

        });


      // -----------------------------------------
      // 5. Crear detalles + actualizar stock
      // -----------------------------------------

      for (const item of dto.details) {

        const subtotal =
          item.quantity *
          item.unitCost;


        await tx.purchaseDetail.create({

          data: {

            purchaseId:
              purchase.id,

            productId:
              item.productId,

            quantity:
              item.quantity,

            unitCost:
              item.unitCost,

            subtotal,

          },

        });


        await tx.product.update({

          where: {
            id: item.productId,
          },

          data: {

            stock: {
              increment:
                item.quantity,
            },

            purchasePrice:
              item.unitCost,

          },

        });

      }


      // -----------------------------------------
      // 6. Registrar movimiento financiero
      // -----------------------------------------

      await this.financialService.registerPurchase(

        {

          purchaseId:
            purchase.id,

          amount:
            Number(purchase.total),

          userId:
            createdById,

          paymentMethod:
            dto.paymentMethod,

        },

        tx,

      );


      // -----------------------------------------
      // 7. Retornar compra
      // -----------------------------------------

      return tx.purchase.findUnique({

        where: {
          id: purchase.id,
        },

        include: {

          supplier: true,

          details: {
            include: {
              product: true,
            },
          },

        },

      });

    });

  }


  async findAll() {

    return this.prisma.purchase.findMany({

      include: {
        supplier: true,
      },

      orderBy: {
        purchaseDate: 'desc',
      },

    });

  }

  /*async findAll() {
  console.log("--- DIAGNÓSTICO EN TABLA PURCHASE ---");
  try {
    const columnas: any = await this.prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND (table_name = 'Purchase' OR table_name = 'purchase');
    `);
    console.log("Columnas físicas reales dentro de Purchase:", columnas);
  } catch (err: any) {
    console.error("Error en diagnóstico:", err.message);
  }
  console.log("--- FIN DIAGNÓSTICO ---");
  return []; // Rompe el bucle temporalmente para que no caliente la CPU
}*/


  async findOne(id: number) {

    const purchase =
      await this.prisma.purchase.findUnique({

        where: {
          id,
        },

        include: {

          supplier: true,

          details: {

            include: {
              product: true,
            },

          },

        },

      });


    if (!purchase) {

      throw new NotFoundException(
        'Compra no encontrada',
      );

    }

    return purchase;

  }

}