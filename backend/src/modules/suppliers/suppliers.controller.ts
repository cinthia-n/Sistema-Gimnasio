import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(dto);
  }

  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.suppliersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, dto);
  }

  @Patch(":id/status")
  toggleStatus(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.suppliersService.toggleStatus(id);
  }

  @Get(":id/detail")
  detail(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.suppliersService.getDetail(id);
  }

  @Get("search/:term")
  search(
    @Param("term") term: string,
  ) {
    return this.suppliersService.search(term);
  }
}
