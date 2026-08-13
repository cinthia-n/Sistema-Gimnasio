import { ServiceType } from "@prisma/client";

export class CreateServiceDto {
  
  name!: string;

  description?: string;

  type!: ServiceType;

  durationDays!: number;

  basePrice!: number;
}