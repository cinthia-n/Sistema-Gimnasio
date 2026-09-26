export class CreateSaleDto {
  userId!: number;
  clientId?: number;

  items!: {
    productId: number;
    quantity: number;
  }[];

  payments!: {
    paymentMethod: 'CASH' | 'QR';
    amount: number;
    reference?: string;
  }[];
}