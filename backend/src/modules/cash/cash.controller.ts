import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { CashService } from './cash.service';

import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';

import { Param, ParseIntPipe } from '@nestjs/common';

@Controller('cash')
export class CashController {

  constructor(
    private readonly cashService: CashService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateCashMovementDto,
  ) {
    return this.cashService.create(dto);
  }

  @Get()
  findAll() {
    return this.cashService.findAll();
  }

  @Post("open")
  openCash(
    @Body() dto: OpenCashDto,
  ) {
    return this.cashService.openCash(dto);
  }

  @Post("close")
  closeCash(
    @Body() dto: CloseCashDto,
  ) {
    return this.cashService.closeCash(dto);
  }

  @Get("summary")
  summary() {
    return this.cashService.getCurrentCashSummary();
  }

  @Get("current")
  current() {

    return this.cashService.getCurrentCash();

  }

  @Get("history")
  findHistory() {
    return this.cashService.findHistory();
  }

  @Get("history/:id")
  findOne(
  @Param("id", ParseIntPipe) id: number,
  ) {
    return this.cashService.findHistoryDetail(id);
  }

}