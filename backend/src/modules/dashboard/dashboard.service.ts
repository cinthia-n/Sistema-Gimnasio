import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async summary() {

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    const activeClients =
      await this.prisma.client.count({
        where: {
          active: true,
        },
      });

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayEnrollments = 
      await this.prisma.clientService.count({
        where: {
          createdAt: {
            gte: today,
          },
          status: { not: "CANCELLED" },
        }
      });
    
    const salesToday = await this.prisma.sale.aggregate({
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      where: {
        saleDate: {
          gte: startToday,
          lte: endToday,
        },
        status: { not: "CANCELLED" },
      },
    });

    const purchasesToday = await this.prisma.purchase.aggregate({
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      where: {
        purchaseDate: {
          gte: startToday,
          lte: endToday,
        },
        status: { not: "CANCELLED"},
      },
    });

    const lowStockProducts =
      await this.prisma.product.findMany({

        where: {

          active: true,

        },

        include:{
          supplier:true,
        },

        orderBy: {

          name: 'asc',

        },

      });

    const lowStock =
      lowStockProducts.filter(

        p => p.stock <= p.minimumStock,

      );
      
    const next3Days = new Date(today);
    next3Days.setDate(next3Days.getDate() + 3);

    const expiringMemberships =
    await this.prisma.clientService.findMany({

      where: {

        status: "ACTIVE",

        endDate: {

            gte: today,

            lte: next3Days,

        },

      },

      include: {

        client: true,

        service: true,

      },

      orderBy: {

        endDate: "asc",

      },

    });


    return {
      cards: {
        activeClients,
        todayEnrollments,
        salesToday: {
          total: Number(salesToday._sum.total ?? 0),
          count: salesToday._count.id,
        },
        purchasesToday: {
          total: Number(purchasesToday._sum.total ?? 0),
          count: purchasesToday._count.id,
        },
      },

      expiringMemberships,

      lowStockProducts: lowStock,
    };
  }
}