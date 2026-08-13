import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { PromotionsService } from './promotions.service';

import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreatePromotionDto,
  ) {
    return this.promotionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreatePromotionDto,
  ) {
    return this.promotionsService.update(
      Number(id),
      dto,
    );
  }

  @Patch(':id/toggle')
  toggleActive(
    @Param('id') id: string,
  ) {
    return this.promotionsService.toggleActive(
      Number(id),
    );
  }
}