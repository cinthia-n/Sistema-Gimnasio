export class RegisterPaymentDto {

  clientServiceId!: number;
  userId!: number;

  payments!: {
    paymentMethod: 'CASH' | 'QR';
    amount: number;
    reference?: string;
  }[];

}