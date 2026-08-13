export class CreateSaleDto {
  userId!: number;
  clientId?: number;

  paymentMethod!: 'CASH' | 'QR';

  items!: {
    productId: number;
    quantity: number;
  }[];
}