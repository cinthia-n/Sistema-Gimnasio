import { Injectable } from '@nestjs/common';

import {
  CashReferenceType,
  PaymentMethod,
  Prisma,
} from '@prisma/client';

import { CashService } from '../cash/cash.service';

@Injectable()
export class FinancialService {

  constructor(
    private readonly cashService: CashService,
  ) {}

  async registerMembershipPayment(
    data: {
      membershipCode: string;
      amount: number;
      paymentMethod: PaymentMethod;
      paymentId: number;
      userId: number;
    },
    tx?: Prisma.TransactionClient,
  ) {

    return this.cashService.registerIncome(
      {
        concept:
          `Pago membresía ${data.membershipCode}`,

        amount: data.amount,

        paymentMethod:
          data.paymentMethod,

        referenceType:
          CashReferenceType.MEMBERSHIP_PAYMENT,

        referenceId:
          data.paymentId,

        createdById:
          data.userId,
      },
      tx,
    );

  }

  async registerProductSale(
    data: {
      saleId: number;
      amount: number;
      paymentMethod: PaymentMethod;
      userId: number;
    },
    tx?: Prisma.TransactionClient,
  ) {

    return this.cashService.registerIncome(
      {
        concept: `Venta #${data.saleId}`,

        amount: data.amount,

        paymentMethod:
          data.paymentMethod,

        referenceType:
          CashReferenceType.PRODUCT_SALE,

        referenceId:
          data.saleId,

        createdById:
          data.userId,
      },
      tx,
    );

  }

  async registerPurchase(
    data: {
      purchaseId: number;
      amount: number;
      userId: number;
      paymentMethod: PaymentMethod;
    },
    tx?: Prisma.TransactionClient,
  ) {

  await this.cashService.registerExpense(
    {
      concept: `Compra #${data.purchaseId}`,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceType: CashReferenceType.PURCHASE,
      referenceId: data.purchaseId,
      createdById: data.userId,
    },
    tx,
  );

  }


}
