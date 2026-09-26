import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()

export class ReportsService {

    constructor(

        private readonly prisma: PrismaService,

    ) {}

    private getDateFilter(from: Date, to: Date) {

        return {

            gte: from,

            lte: to,

        };

    }

    private sumDecimals<T>(
        items: T[],
        selector: (item: T) => number,
    ) {

        return items.reduce(

            (sum, item) => sum + selector(item),

            0,

        );

    }

    private getRange(

        startDate: string,

        endDate: string,

    ) {

        const start = new Date(startDate);

        start.setHours(0,0,0,0);

        const end = new Date(endDate);

        end.setHours(23,59,59,999);

        return {

            start,

            end,

        };

    }

    async sales(from: Date, to: Date) {

        const sales = await this.prisma.sale.findMany({

            where: {

                saleDate: this.getDateFilter(from, to),
                status: { not: 'CANCELLED' },
            },

            include: {

                client: {

                    select: {

                        id: true,
                        fullName: true,
                        ci: true,

                    },

                },

                user: {

                    select: {

                        id: true,
                        fullName: true,

                    },

                },

                details: {

                    include: {

                        product: {

                            select: {

                                id: true,
                                code: true,
                                name: true,

                            },

                        },

                    },

                },

            },

            orderBy: {

                saleDate: "desc",

            },

        });

     const total = this.sumDecimals(

        sales,

        sale => Number(sale.total),

    );

    return {

        total,

        quantity: sales.length,

        sales,

    };

    }

    async purchases(from: Date, to: Date) {

        const purchases = await this.prisma.purchase.findMany({

            where: {

                purchaseDate: this.getDateFilter(from, to),

            },

        include: {

            supplier: {

                select: {

                    id: true,
                    name: true,

                },

            },

        createdBy: {

            select: {

                id: true,
                fullName: true,

            },

        },

        details: {

            include: {

                product: {

                    select: {

                        id: true,
                        code: true,
                        name: true,

                    },

                },

            },

        },

        },

        orderBy: {

            purchaseDate: "desc",

        },

    });

    const total = this.sumDecimals(

        purchases,

        purchase => Number(purchase.total),

    );

    return {

        total,

        quantity: purchases.length,

        purchases,

    };

    }

    async enrollments(from: Date, to: Date) {

        const enrollments = await this.prisma.clientService.findMany({

            where: {

                createdAt: this.getDateFilter(from, to),
                status: { not: 'CANCELLED' },
            },

            include: {

                client: {

                    select: {

                        id: true,
                        fullName: true,
                        ci: true,

                    },

                },

                service: {

                    select: {

                        id: true,
                        name: true,

                    },

                },

                promotion: {

                     select: {

                        id: true,
                        name: true,

                    },

                },

            },

            orderBy: {

                createdAt: "desc",

            },

        });

        const total = this.sumDecimals(

            enrollments,

            enrollment => Number(enrollment.finalPrice),

        );

         return {

            total,

            quantity: enrollments.length,

            enrollments,

        };

    }

    async cash(from: Date, to: Date) {

        const movements = await this.prisma.cashMovement.findMany({

             where: {

                movementDate: {

                    gte: from,
                    lte: to,

                },

                status: "CONFIRMED",

            },

            include: {

                createdBy: {

                    select: {

                        id: true,
                        fullName: true,

                    },

                },

            },

            orderBy: {

                movementDate: "desc",

            },

        });

        const income = this.sumDecimals(

            movements.filter(

                m => m.type === "INCOME",

            ),

            m => Number(m.amount),

        );

        const expense = this.sumDecimals(

            movements.filter(

                m => m.type === "EXPENSE",

            ),

            m => Number(m.amount),

        );

        return {

            income,

            expense,

            balance: income - expense,

            quantity: movements.length,

            movements,

         };

    }

}