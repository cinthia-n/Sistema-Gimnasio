import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import {
  CashMovementType,
  PaymentMethod,
} from '@prisma/client';

@Injectable()
export class FinancialReportService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async todaySummary() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1,
    );

    const incomes =
      await this.prisma.cashMovement.findMany({
        where: {
          movementDate: {
            gte: today,
            lt: tomorrow,
          },
          type: CashMovementType.INCOME,
        },
      });

    const expenses =
      await this.prisma.cashMovement.findMany({
        where: {
          movementDate: {
            gte: today,
            lt: tomorrow,
          },
          type: CashMovementType.EXPENSE,
        },
      });

    const cashIncome =
      incomes
        .filter(
          i =>
            i.paymentMethod ===
            PaymentMethod.CASH,
        )
        .reduce(
          (sum, i) =>
            sum + Number(i.amount),
          0,
        );

    const qrIncome =
      incomes
        .filter(
          i =>
            i.paymentMethod ===
            PaymentMethod.QR,
        )
        .reduce(
          (sum, i) =>
            sum + Number(i.amount),
          0,
        );

    const totalIncome =
      incomes.reduce(
        (sum, i) =>
          sum + Number(i.amount),
        0,
      );

    const totalExpense =
      expenses.reduce(
        (sum, e) =>
          sum + Number(e.amount),
        0,
      );

    return {
      income: totalIncome,
      expense: totalExpense,
      cash: cashIncome,
      qr: qrIncome,
      expectedCash:
        totalIncome - totalExpense,
    };

  }

}