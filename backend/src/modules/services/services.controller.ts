import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { UpdateServiceDto } from './dto/update-service.dto';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  //---------------------------------------
  // Buscar por ID
  //---------------------------------------

  @Get(':id')
  findOne(

    @Param('id', ParseIntPipe)
    id: number,

  ) {

    return this.servicesService.findOne(id);

  }

  //---------------------------------------
  // Editar
  //---------------------------------------

  @Patch(':id')
  update(

    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateServiceDto,

  ) {

    return this.servicesService.update(
      id,
      dto,
    );

  }

    //---------------------------------------
  // Activar / Desactivar
  //---------------------------------------

  @Patch(':id/toggle')
  toggle(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    return this.servicesService.toggle(id);

  }

  //---------------------------------------
  // Eliminar (lógico)
  //---------------------------------------

  @Delete(':id')
  remove(

    @Param('id', ParseIntPipe)
    id: number,

  ) {

    return this.servicesService.remove(id);

  }

  
}