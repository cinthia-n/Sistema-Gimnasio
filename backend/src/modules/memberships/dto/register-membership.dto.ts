export class RegisterMembershipDto {

  existingClient!: boolean;
  clientId?: number;

  client?: {
    fullName: string;
    ci: string;
    phone: string;
  };

  serviceId!: number;
  promotionId?: number;
  isStudent!: boolean;

  payments!: {
    paymentMethod: 'CASH' | 'QR';
    amount: number;
    reference?: string;
  }[];

  userId!: number;
}