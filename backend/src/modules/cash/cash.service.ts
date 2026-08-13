import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

import { Prisma } from '@prisma/client';

//import { OpenCashDto } from './dto/open-cash.dto';

import {
  CashMovementType,
  CashReferenceType,
  PaymentMethod,
} from '@prisma/client';
import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';

type PrismaTransaction = Prisma.TransactionClient;

@Injectable()
export class CashService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCashMovementDto) {

    return this.prisma.cashMovement.create({
      data: dto,
    });

  }

  async registerIncome(
    data: {
        concept: string;
        amount: number;
        paymentMethod?: PaymentMethod;
        referenceType?: CashReferenceType;
        referenceId?: number;
        createdById: number;
        notes?: string;
    },
        tx?: PrismaTransaction,
    ) {
    const prisma = tx ?? this.prisma;

    return prisma.cashMovement.create({
        data: {
        type: CashMovementType.INCOME,
        ...data,
        },
    });
    }

    async registerExpense(
        data: {
        concept: string;
        amount: number;
        paymentMethod?: PaymentMethod;
        referenceType?: CashReferenceType;
        referenceId?: number;
        createdById: number;
        notes?: string;
        },
        tx?: PrismaTransaction,
    ) {
        const prisma = tx ?? this.prisma;

    return prisma.cashMovement.create({
        data: {
        type: CashMovementType.EXPENSE,
        ...data,
        },
    });
    }

  async openCash(dto: OpenCashDto) {

    const opened =
      await this.prisma.cashClosing.findFirst({

        where: {
          status: "OPEN",
        },

      });

    if (opened) {

      throw new Error(
        "Ya existe una caja abierta.",
      );

    }

    return this.prisma.cashClosing.create({

    data: {

      openingCash: dto.openingCash,

      observations: dto.observations,

      openedById: dto.openedById,

    },

    });

  }

  async closeCash(dto: CloseCashDto) {

    const cash =
      await this.prisma.cashClosing.findFirst({

        where: {
            status: "OPEN",
        },

      });

    if (!cash) {

      throw new Error(
        "No existe una caja abierta.",
      );

    }

    const movements =
      await this.prisma.cashMovement.findMany({

        where: {

          movementDate: {
            gte: cash.openingDate,
          },

          paymentMethod: "CASH",

        },

      });

    const income =
      movements
        .filter(m => m.type === "INCOME")
        .reduce(
          (sum, m) =>
            sum + Number(m.amount),
          0,
        );

    const expense =
      movements
        .filter(m => m.type === "EXPENSE")
        .reduce(
          (sum, m) =>
            sum + Number(m.amount),
          0,
        );

    const expectedCash =
      Number(cash.openingCash) +
      income -
      expense;

    const difference =
      Number(dto.countedCash) -
      expectedCash;

    return this.prisma.cashClosing.update({

      where: {
        id: cash.id,
      },

      data: {

        closingDate: new Date(),

        countedCash: dto.countedCash,

        expectedCash,

        difference,

        observations: dto.observations,

        closedById: dto.closedById,

        status: "CLOSED",

      },

    });

  }
  async getCurrentCashSummary() {

    const cash = await this.prisma.cashClosing.findFirst({

      where: {
        status: "OPEN",
      },

    });

    if (!cash) {

      throw new Error(
        "No existe una caja abierta.",
      );

    }

    const movements =
      await this.prisma.cashMovement.findMany({

        where: {

        movementDate: {

            gte: cash.openingDate,

          },

        },

    });

  console.log("================================");
  console.log("Fecha apertura:", cash.openingDate);
  console.log("Cantidad movimientos:", movements.length);
  console.log("Movimientos:", movements);
  console.log("================================");


  const membershipCash =
    movements
      .filter(m =>
        m.type === "INCOME" &&
        m.referenceType === "MEMBERSHIP_PAYMENT" &&
        m.paymentMethod === "CASH",
      )
      .reduce(
        (sum, m) => sum + Number(m.amount),
        0,
      );

  const membershipQr =
    movements
      .filter(m =>
        m.type === "INCOME" &&
        m.referenceType === "MEMBERSHIP_PAYMENT" &&
        m.paymentMethod === "QR",
      )
      .reduce(
        (sum, m) => sum + Number(m.amount),
        0,
      );

  const salesCash =
    movements
      .filter(m =>
        m.type === "INCOME" &&
        m.referenceType === "PRODUCT_SALE" &&
        m.paymentMethod === "CASH",
      )
      .reduce(
        (sum, m) => sum + Number(m.amount),
        0,
      );

  const salesQr =
    movements
      .filter(m =>
        m.type === "INCOME" &&
        m.referenceType === "PRODUCT_SALE" &&
        m.paymentMethod === "QR",
      )
      .reduce(
        (sum, m) => sum + Number(m.amount),
        0,
      );

  const expenses =
    movements
      .filter(m =>
        m.type === "EXPENSE",
      )
      .reduce(
        (sum, m) => sum + Number(m.amount),
        0,
      );

  const totalCashIncome =
    membershipCash + salesCash;

  const totalQrIncome =
    membershipQr + salesQr;

  const expectedCash =
    Number(cash.openingCash) +
    totalCashIncome -
    expenses;

  return {

    openingCash:
      Number(cash.openingCash),

    membershipCash,

    membershipQr,

    salesCash,

    salesQr,

    totalCashIncome,

    totalQrIncome,

    expenses,

    expectedCash,

    openingDate:
      cash.openingDate,

  };

}

  async findAll() {

    return this.prisma.cashMovement.findMany({

      include: {
        createdBy: true,
      },

      orderBy: {
        movementDate: 'desc',
      },

    });

  }

  async getCurrentCash() {

    return this.prisma.cashClosing.findFirst({

      where: {
        status: "OPEN",
      },

      orderBy: {
        openingDate: "desc",
      },

    });

  }

  async findHistory() {
  return this.prisma.cashClosing.findMany({
    include: {
      openedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
      closedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      openingDate: "desc",
    },
  });
  }

  async findHistoryDetail(id: number) {

    const cash = await this.prisma.cashClosing.findUnique({

      where: {
        id,
      },

      include: {

        openedBy: true,

        closedBy: true,

      },

    });

    if (!cash) {

      throw new Error("Cierre de caja no encontrado");

    }

    const movements =
      await this.prisma.cashMovement.findMany({

        where: {

          movementDate: {

            gte: cash.openingDate,

            lte: cash.closingDate ?? new Date(),

          },

        },

      });

    const membershipCash =
      movements
        .filter(m =>
          m.type === "INCOME" &&
          m.referenceType === "MEMBERSHIP_PAYMENT" &&
          m.paymentMethod === "CASH",
        )
        .reduce((s, m) => s + Number(m.amount), 0);

    const membershipQr =
      movements
        .filter(m =>
          m.type === "INCOME" &&
          m.referenceType === "MEMBERSHIP_PAYMENT" &&
          m.paymentMethod === "QR",
        )
        .reduce((s, m) => s + Number(m.amount), 0);

    const salesCash =
      movements
        .filter(m =>
          m.type === "INCOME" &&
          m.referenceType === "PRODUCT_SALE" &&
          m.paymentMethod === "CASH",
        )
        .reduce((s, m) => s + Number(m.amount), 0);

    const salesQr =
      movements
        .filter(m =>
          m.type === "INCOME" &&
          m.referenceType === "PRODUCT_SALE" &&
          m.paymentMethod === "QR",
        )
        .reduce((s, m) => s + Number(m.amount), 0);

    const expenses =
      movements
        .filter(m => m.type === "EXPENSE")
        .reduce((s, m) => s + Number(m.amount), 0);

    return {

      ...cash,

      membershipCash,

      membershipQr,

      salesCash,

      salesQr,

      expenses,

    };

  }

}