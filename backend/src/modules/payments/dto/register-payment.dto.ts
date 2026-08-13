import { PaymentMethod } from '@prisma/client';

export class RegisterPaymentDto {

    clientServiceId!: number;

    amount!: number;

    paymentMethod!: PaymentMethod;

    userId!: number;

    reference?: string;

}