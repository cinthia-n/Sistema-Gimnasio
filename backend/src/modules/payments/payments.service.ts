import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { RegisterPaymentDto } from './dto/register-payment.dto';

import { CashService } from '../cash/cash.service';

import { CashReferenceType } from '@prisma/client';

import { FinancialService } from '../financial/financial.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly financialService: FinancialService,
  ) {}

 
async registerPayment(dto: RegisterPaymentDto) {

  return this.prisma.$transaction(async (tx) => {

    const enrollment = await tx.clientService.findUnique({
        where: { id: dto.clientServiceId },
    });

    if (!enrollment) {
        throw new NotFoundException('Inscripción no encontrada');
    }

    if (Number(enrollment.balanceDue) <= 0) {
        throw new BadRequestException('Esta inscripción ya fue pagada completamente');
    }

    if (!dto.payments?.length) {
        throw new BadRequestException('Debe registrar al menos un pago');
    }

    const totalAmount = dto.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
    );

    if (totalAmount <= 0) {
        throw new BadRequestException('El monto debe ser mayor a cero');
    }

    if (totalAmount > Number(enrollment.balanceDue)) {
        throw new BadRequestException(
            `El pago excede el saldo pendiente de Bs ${Number(enrollment.balanceDue)}`,
        );
    }

    for (const paymentLine of dto.payments) {

        const payment = await tx.payment.create({
            data: {
                clientServiceId: dto.clientServiceId,
                amount: paymentLine.amount,
                paymentMethod: paymentLine.paymentMethod,
                userId: dto.userId,
                reference: paymentLine.reference,
            },
        });

        await this.financialService.registerMembershipPayment({
            membershipCode: enrollment.membershipCode,
            amount: Number(payment.amount),
            paymentMethod: payment.paymentMethod,
            paymentId: payment.id,
            userId: payment.userId,
        }, tx);
    }

    const paidAmount = Number(enrollment.paidAmount) + totalAmount;

    const balanceDue = Math.max(
        Number(enrollment.finalPrice) - paidAmount,
        0,
    );

    const updatedEnrollment = await tx.clientService.update({
        where: { id: enrollment.id },
        data: { paidAmount, balanceDue },
        include: { client: true, service: true, promotion: true, payments: true },
    });

    return updatedEnrollment;

  });

}

async findPendingMemberships(
  clientId: number,
) {

  return this.prisma.clientService.findMany({

    where: {

      clientId,

      balanceDue: {

        gt: 0,

      },

    },

    include: {

      service: true,

      payments: {

        orderBy: {

          paymentDate: "desc",

        },

      },

    },

    orderBy: {

      createdAt: "desc",

    },

  });

}

async findAllPendingMemberships() {

  return this.prisma.clientService.findMany({

    where: {

      balanceDue: {

        gt: 0,

      },

    },

    include: {

      client: true,

      service: true,

    },

    orderBy: {

      createdAt: "desc",

    },

  });

}


async findAll() {
    return this.prisma.payment.findMany({
      include: {
        clientService: true,
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}