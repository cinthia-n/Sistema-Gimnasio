import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ServicePricesService } from './service-prices.service';
import { CreateServicePriceDto } from './dto/create-service-price.dto';

@Controller('service-prices')
export class ServicePricesController {
  constructor(
    private readonly servicePricesService: ServicePricesService,
  ) {}

  @Post()
  create(@Body() dto: CreateServicePriceDto) {
    return this.servicePricesService.create(dto);
  }

  @Get()
  findAll() {
    return this.servicePricesService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateServicePriceDto,
  ) {
    return this.servicePricesService.update(
      Number(id),
      dto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicePricesService.remove(
      Number(id),
    );
  }
}