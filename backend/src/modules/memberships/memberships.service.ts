import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterMembershipDto } from './dto/register-membership.dto';
import { FinancialService } from '../financial/financial.service';
import { Service } from '@prisma/client';
@Injectable()
export class MembershipsService {
    constructor(
    private readonly prisma: PrismaService,
    private readonly financialService: FinancialService,
  ) {}

  
  private calculateBalance(

    finalPrice: number,

    paidAmount: number,

  ) {

    const balance = finalPrice - paidAmount;

    return balance < 0

        ? 0

        : balance;

  }

  private async generateCode(tx: PrismaService | any) {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1,
    ).padStart(2, '0');

    const count =
        await tx.clientService.count();

    return `GYM-${year}${month}-${String(
        count + 1,
    ).padStart(4, '0')}`;

  }

  async findByCode(code: string) {
  return this.prisma.clientService.findUnique({
    where: {
      membershipCode: code,
    },
    include: {
      client: true,
      service: true,
      promotion: true,
      payments: true,
    },
  });
}

async register(dto: RegisterMembershipDto) {

  return this.prisma.$transaction(async (tx) => {

    //--------------------------------------------------
    // 1. Obtener o crear cliente
    //--------------------------------------------------

    let client;

    if (dto.existingClient) {

      client = await tx.client.findUnique({
        where: {
          id: dto.clientId,
        },
      });

      if (!client) {
        throw new NotFoundException('Cliente no encontrado');
      }

    } else {

      if (!dto.client) {
        throw new BadRequestException('Datos del cliente requeridos');
      }

      client = await tx.client.create({
        data: {
          fullName: dto.client.fullName,
          ci: dto.client.ci,
          phone: dto.client.phone,
          //isStudent: dto.client.isStudent,
        },
      });

    }

    
    //--------------------------------------------------
    // 2. Obtener servicio
    //--------------------------------------------------

    let service: Service | null = null;

    if (dto.serviceId) {

      service =
        await tx.service.findUnique({
          where: {
            id: dto.serviceId,
          },
        });

      if (!service) {
        throw new NotFoundException(
          'Servicio no encontrado',
        );
      }
    }
    ///--------------------------------------------------
// 3. Obtener promoción
//--------------------------------------------------

    const promotion = dto.promotionId
      ? await tx.promotion.findUnique({
       where: {
          id: dto.promotionId,
        },
      })
    : null;

    if (dto.promotionId && !promotion) {
      throw new NotFoundException(
        'Promoción no encontrada',
      );
    }

    //--------------------------------------------------
    // 4. Calcular precios
    //--------------------------------------------------

    let basePrice: number;
    let finalPrice: number;
    let discount = 0;
    let durationDays: number;

    //--------------------------------------------------
  // INSCRIPCIÓN POR PROMOCIÓN
    //--------------------------------------------------

    if (promotion) {

      if (promotion.price === null) {
        throw new BadRequestException(
          'La promoción no tiene un precio configurado',
        );
      }

      basePrice = Number(promotion.price);

      finalPrice = basePrice;

      durationDays = promotion.durationDays;

    }
      //--------------------------------------------------
    // INSCRIPCIÓN POR SERVICIO
    //--------------------------------------------------

    else {

      if (!service) {
        throw new BadRequestException(
          'Debe seleccionar un servicio o una promoción',
        );
      }

      if (dto.isStudent) {

        // Solo Mensual y Grupal tienen
        // tarifa diferenciada para estudiantes.

        if (
          service.code !== 'MONTHLY' &&
          service.code !== 'GROUP'
        ) {
          throw new BadRequestException(
            'Este servicio no tiene tarifa para estudiantes',
          );
        }

        const studentPrice =
          await tx.servicePrice.findFirst({
           where: {
              serviceId: service.id,
              isStudent: true,
            },
          });

        if (!studentPrice) {
          throw new BadRequestException(
            'No existe una tarifa configurada para estudiantes para este servicio',
          );
        }

        basePrice = Number(
          studentPrice.price,
        );

      } else {

        basePrice = Number(
          service.basePrice,
        );

      }

      finalPrice = basePrice;

      durationDays =
        service.durationDays;
    }

    const paidAmount =
      dto.paymentAmount;

    const balanceDue =
      this.calculateBalance(
        finalPrice,
        paidAmount,
      );
    //--------------------------------------------------
    // 5. Crear código
    //--------------------------------------------------

    const membershipCode =
      await this.generateCode(tx);

    //--------------------------------------------------
    // 6. Fechas
    //--------------------------------------------------

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(
      endDate.getDate() + durationDays,
    );

    //--------------------------------------------------
    // 7. Crear inscripción
    //--------------------------------------------------

    const enrollment =
      await tx.clientService.create({

        data: {

          clientId: client.id,

          serviceId: service?.id ?? null,

          promotionId: promotion?.id ?? null,

          membershipCode,

          startDate,

          endDate,

          basePrice,

          isStudent: promotion
                      ? false
                      : dto.isStudent,

          discount,

          finalPrice,

          paidAmount,

          balanceDue,

        },

      });

    //--------------------------------------------------
    // 8. Registrar primer pago
    //--------------------------------------------------

    const payment = await tx.payment.create({

      data: {

        clientServiceId: enrollment.id,

        userId: dto.userId,

        amount: paidAmount,

        paymentMethod: dto.paymentMethod,

        reference: dto.paymentReference,

      },

    });

    await this.financialService.registerMembershipPayment(
      {
        membershipCode: enrollment.membershipCode,
        amount: Number(payment.amount),
        paymentMethod: payment.paymentMethod,
        paymentId: payment.id,
        userId: payment.userId,
      },
      tx,
    );

    //--------------------------------------------------
    // 9. Retornar inscripción completa
    //--------------------------------------------------

    return tx.clientService.findUnique({

      where: {

        id: enrollment.id,

      },

      include: {

        client: true,

        service: true,

        promotion: true,

        payments: true,

      },

    });

  });

}

async findAll(){
  return this.prisma.clientService.findMany({
    include: {
      client: true,
      service: true,
      promotion: true,
      payments: true,
    },
    orderBy:{
      id: 'desc',
    },
  });
}
}