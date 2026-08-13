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

  paymentMethod!: 'CASH' | 'QR';

  paymentAmount!: number;

  userId!: number;

  paymentReference?: string;

}