import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  //---------------------------------------
  // Crear (solo ADMIN)
  //---------------------------------------

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }

  //---------------------------------------
  // Listado (todos los roles)
  //---------------------------------------

  @Get()
  findAll(
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(search);
  }

  //---------------------------------------
  // Productos disponibles para venta (todos los roles)
  //---------------------------------------

  @Get('available')
  available() {
    return this.productsService.available();
  }

  //---------------------------------------
  // Productos con bajo stock (todos los roles)
  //---------------------------------------

  @Get('low-stock')
  lowStock() {
    return this.productsService.lowStock();
  }

  //---------------------------------------
  // Productos por proveedor (todos los roles)
  //---------------------------------------

  @Get('supplier/:id')
  findBySupplier(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.findBySupplier(id);
  }

  //---------------------------------------
  // Buscar por ID (todos los roles)
  //---------------------------------------

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  //---------------------------------------
  // Editar (solo ADMIN)
  //---------------------------------------

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  //---------------------------------------
  // Eliminar lógico (solo ADMIN)
  //---------------------------------------

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(id);
  }
}