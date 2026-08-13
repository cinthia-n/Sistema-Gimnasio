import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { RegisterPaymentDto } from './dto/register-payment.dto';

import { CashService } from '../cash/cash.service';

import { CashReferenceType } from '@prisma/client';

import { FinancialService } from '../financial/financial.service';

@Injectable()
export class PaymentsService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly financialService: FinancialService,
  ) {}

 
async registerPayment(dto: RegisterPaymentDto) {

  return this.prisma.$transaction(async (tx) => {

    //-----------------------------------------
    // Buscar inscripción
    //-----------------------------------------

    const enrollment =
      await tx.clientService.findUnique({

        where: {
          id: dto.clientServiceId,
        },

      });

    if (!enrollment) {

      throw new Error(
        'Inscripción no encontrada',
      );

    }

  //-----------------------------------------
  // Verificar que exista saldo pendiente
  //-----------------------------------------

    if (Number(enrollment.balanceDue) <= 0) {

      throw new Error(
        'Esta inscripción ya fue pagada completamente',
      );

    }

  //-----------------------------------------
  // Validar monto
  //-----------------------------------------

    if (dto.amount <= 0) {

      throw new Error(
          'El monto debe ser mayor a cero',
      );

    }


  //-----------------------------------------
  // Validar saldo pendiente
  //-----------------------------------------

    if (Number(dto.amount)>Number(enrollment.balanceDue)) {

      throw new Error(
          `El pago excede el saldo pendiente de Bs ${Number(enrollment.balanceDue)}`
      );

    }


    //-----------------------------------------
    // Registrar pago
    //-----------------------------------------

    const payment =
      await tx.payment.create({

        data: {

          clientServiceId: dto.clientServiceId,

          amount: dto.amount,

          paymentMethod: dto.paymentMethod,

          userId: dto.userId,

          reference: dto.reference,

        },

      });

    //-----------------------------------------
    // Calcular nuevos montos
    //-----------------------------------------

    const paidAmount =
      Number(enrollment.paidAmount) +
      Number(dto.amount);

    const balanceDue =
      Math.max(
        Number(enrollment.finalPrice) - paidAmount,
        0,
      );

    //-----------------------------------------
    // Actualizar inscripción
    //-----------------------------------------

    const updatedEnrollment =
      await tx.clientService.update({

        where: {
          id: enrollment.id,
        },

        data: {

          paidAmount,

          balanceDue,

        },

        include: {

          client: true,

          service: true,

          promotion: true,

          payments: true,

        },

      });

    //-----------------------------------------
    // Registrar movimiento financiero
    //-----------------------------------------

    await this.financialService.registerMembershipPayment({

      membershipCode: enrollment.membershipCode,

      amount: Number(payment.amount),

      paymentMethod: payment.paymentMethod,

      paymentId: payment.id,

      userId: payment.userId,

    });

    //-----------------------------------------
    // Retornar inscripción actualizada
    //-----------------------------------------

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