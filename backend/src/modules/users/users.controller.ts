import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService,
  ) {}


  // ==========================================
  // LISTAR EMPLEADAS
  // GET /users/employees
  // ==========================================

  @Get('employees')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(UserRole.ADMIN)
  findEmployees() {

    return this.userService.findEmployees();

  }


  // ==========================================
  // CREAR EMPLEADA
  // POST /users/employees
  // ==========================================

  @Post('employees')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(UserRole.ADMIN)
  createEmployee(
    @Body() dto: CreateUserDto,
  ) {

    return this.userService.createEmployee(
      dto,
    );

  }

}