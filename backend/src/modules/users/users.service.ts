import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // LISTAR EMPLEADAS
  // ==========================================

  async findEmployees() {

    return this.prisma.user.findMany({

      where: {
        role: UserRole.EMPLOYEE,
      },

      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        passwordChangedAt: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

  }


  // ==========================================
  // CREAR EMPLEADA
  // ==========================================

  async createEmployee(
    dto: CreateUserDto,
  ) {

    const existingUser =
      await this.prisma.user.findUnique({

        where: {
          username: dto.username,
        },

      });

    if (existingUser) {

      throw new BadRequestException(
        'El nombre de usuario ya existe',
      );

    }

    const passwordHash =
      await bcrypt.hash(
        dto.password,
        10,
      );

    const user =
      await this.prisma.user.create({

        data: {

          username:
            dto.username,

          fullName:
            dto.fullName,

          password:
            passwordHash,

          // Este endpoint solamente
          // crea empleados
          role:
            UserRole.EMPLOYEE,

          isActive:
            true,

          mustChangePassword:
            true,

          passwordChangedAt:
            null,

        },

        select: {

          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: true,

        },

      });

    return user;

  }

}