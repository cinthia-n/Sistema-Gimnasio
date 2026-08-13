import {
  IsInt,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';

export class CreatePurchaseDetailDto {

  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsPositive()
  unitCost!: number;
}