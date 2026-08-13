export class CreatePromotionDto {
  name!: string;

  description?: string;

  price?: number;

  startDate!: string;

  endDate!: string;

  durationDays!: number;

  active?: boolean;
}