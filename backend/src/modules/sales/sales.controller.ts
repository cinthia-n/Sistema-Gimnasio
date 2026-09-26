import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  
} from '@nestjs/common';

import { SalesService } from './sales.service';

import { CreateSaleDto } from './dto/create-sale.dto';

import { Param } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParseIntPipe } from '@nestjs/common';
@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSaleDto,
  ) {
    return this.salesService.create(dto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.salesService.findOne(
      Number(id),
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { reason: string },
    @Req() req: any,
  ) {
      return this.salesService.cancel(id, req.user.sub, req.user.role, dto.reason);
  }

}