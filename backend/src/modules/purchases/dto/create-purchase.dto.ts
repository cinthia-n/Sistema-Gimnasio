import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { PaymentMethod } from '@prisma/client';

import { CreatePurchaseDetailDto } from './create-purchase-detail.dto';

export class CreatePurchaseDto {

  @IsInt()
  supplierId!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  details!: CreatePurchaseDetailDto[];
}