import { IsEnum, IsInt, IsNumber, IsPositive, Min } from 'class-validator';
import { ProductPriceType } from '@prisma/client';

export class CreateProductPriceDto {

  @IsEnum(ProductPriceType)
  type: ProductPriceType;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(1)
  minimumQuantity: number;

}