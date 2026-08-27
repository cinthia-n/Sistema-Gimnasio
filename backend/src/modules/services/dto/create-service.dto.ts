import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class CreateServiceDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ServiceType)
  type!: ServiceType;

  @IsNumber()
  @Min(1)
  durationDays!: number;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  studentPrice?: number | null;
}