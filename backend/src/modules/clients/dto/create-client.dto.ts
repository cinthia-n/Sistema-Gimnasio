import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

import { Gender } from '@prisma/client';

export class CreateClientDto {

  @IsString()
  fullName!: string;

  @IsString()
  ci!: string;

  @IsString()
  phone!: string;

  @IsBoolean()
  isStudent!: boolean;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  address?: string;

}