import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { SalesService } from './sales.service';

import { CreateSaleDto } from './dto/create-sale.dto';

import { Param } from '@nestjs/common';

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

}