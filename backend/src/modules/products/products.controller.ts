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
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  //---------------------------------------
  // Crear
  //---------------------------------------

  @Post()
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }

  //---------------------------------------
  // Listado
  //---------------------------------------

  @Get()
  findAll(
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(search);
  }

  //---------------------------------------
  // Productos disponibles para venta
  //---------------------------------------

  @Get('available')
  available() {
    return this.productsService.available();
  }

  //---------------------------------------
  // Productos con bajo stock
  //---------------------------------------

  @Get('low-stock')
  lowStock() {
    return this.productsService.lowStock();
  }

  //---------------------------------------
  // Productos por proveedor
  //---------------------------------------

  @Get('supplier/:id')
  findBySupplier(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.findBySupplier(id);
  }

  //---------------------------------------
  // Buscar por ID
  //---------------------------------------

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  //---------------------------------------
  // Editar
  //---------------------------------------

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  //---------------------------------------
  // Eliminar lógico
  //---------------------------------------

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(id);
  }
}