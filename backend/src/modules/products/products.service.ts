import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  //---------------------------------------
  // Crear producto
  //---------------------------------------

  async create(dto: CreateProductDto) {

    const lastProduct =
      await this.prisma.product.findFirst({

        orderBy: {
          id: 'desc',
        },

      });

    const nextNumber =
      (lastProduct?.id ?? 0) + 1;

    const code =
      `PRD${String(nextNumber).padStart(5, '0')}`;

    return this.prisma.product.create({

      data: {

        supplierId: dto.supplierId,

        code,

        name: dto.name,

        purchasePrice: dto.purchasePrice,

        stock: 0,

        minimumStock: dto.minimumStock,

        prices: {

          create: dto.prices.map(price => ({

            type: price.type,

            price: price.price,

            minimumQuantity: price.minimumQuantity,

          })),

        },

      },

      include: {

        supplier: true,

        prices: true,

      },

    });

  }

  //---------------------------------------
// Listado
//---------------------------------------

  async findAll(search?: string) {

    return this.prisma.product.findMany({

      where: {

        active: true,

        ...(search && {

          OR: [

            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },

            {
              code: {
                contains: search,
              },
            },

          ],

        }),

      },

      include: {

        supplier: true,

        prices: {

          orderBy: {
            minimumQuantity: 'asc',
          },

        },

      },

      orderBy: {

        name: 'asc',

      },

    });

  }

  //---------------------------------------
// Buscar por ID
//---------------------------------------

  async findOne(id: number) {

    const product = await this.prisma.product.findUnique({

        where: {
      id,
      },

      include: {

        supplier: true,

        prices: {

          orderBy: {
            minimumQuantity: 'asc',
          },

        },

      },

    });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }

    return product;

  }

  //---------------------------------------
// Editar producto
//---------------------------------------

  async update(
    id: number,
    dto: UpdateProductDto,
  ) {

    const product = await this.prisma.product.findUnique({

      where: {
        id,
      },

    });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }

    await this.prisma.$transaction(async (tx) => {

      await tx.product.update({

        where: {
          id,
        },

        data: {

          supplierId: dto.supplierId,

          name: dto.name,

          purchasePrice: dto.purchasePrice,

          minimumStock: dto.minimumStock,

        },

      });

      await tx.productPrice.deleteMany({

        where: {
          productId: id,
        },

      });

      await tx.productPrice.createMany({

        data: dto.prices!.map(price => ({

          productId: id,

          type: price.type,

          price: price.price,

          minimumQuantity: price.minimumQuantity,

        })),

      });

    });

    return this.findOne(id);

  }

  //---------------------------------------
  // Eliminar producto
  //---------------------------------------

  async remove(id: number) {

    const product = await this.prisma.product.findUnique({

      where: {
        id,
      },

    });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }

    return this.prisma.product.update({

      where: {
        id,
      },

      data: {
        active: false,
      },

    });

  }

  //---------------------------------------
  // Productos disponibles para venta
  //---------------------------------------

  async available() {

    return this.prisma.product.findMany({

      where: {

        active: true,

        stock: {

          gt: 0,

        },

      },

      include: {

        prices: {

          orderBy: {

            minimumQuantity: 'asc',

          },

        },

      },

      orderBy: {

        name: 'asc',

      },

    });

  }

  //---------------------------------------
  // Productos con bajo stock
  //---------------------------------------

  async lowStock() {

    const products = await this.prisma.product.findMany({

      where: {

        active: true,

      },

      include: {

        supplier: true,

        prices: true,

      },

    });

    return products.filter(

      product => product.stock <= product.minimumStock,

    );

  }
  //---------------------------------------
  // Productos por proveedor
  //---------------------------------------

  async findBySupplier(
    supplierId: number,
  ) {

    return this.prisma.product.findMany({

      where: {

        supplierId,

        active: true,

      },

      include: {

        prices: {

          orderBy: {

            minimumQuantity: 'asc',

          },

        },

      },

      orderBy: {

        name: 'asc',

      },

    });

  }
}