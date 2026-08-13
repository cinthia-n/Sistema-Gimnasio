import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  CashMovementType,
  PaymentMethod,
} from '@prisma/client';

export class CreateCashMovementDto {

  @IsEnum(CashMovementType)
  type!: CashMovementType;

  @IsString()
  concept!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsInt()
  referenceId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  createdById!: number;
}