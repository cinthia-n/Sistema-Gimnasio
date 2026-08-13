import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Query } from '@nestjs/common';

import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  findAll(
    @Query('search')
    search?: string,
  ) {
    console.log('BUSQUEDA:', search);
    return this.clientsService.findAll(search);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.clientsService.findOne(id);
  }

@Put(':id')
update(

  @Param('id', ParseIntPipe)
  id: number,

  @Body()
  dto: CreateClientDto,

) {

  return this.clientsService.update(
    id,
    dto,
  );

}

@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.clientsService.remove(id);
}
}