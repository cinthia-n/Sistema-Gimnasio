import {
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

import { UserRole } from '@prisma/client';

export class CreateUserDto {

  @IsString()
  username!: string;

  @IsString()
  fullName!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}