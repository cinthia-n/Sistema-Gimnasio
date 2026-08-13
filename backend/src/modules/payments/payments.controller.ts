import {
  Body,
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';

import { RegisterPaymentDto } from './dto/register-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  register(
    @Body() dto: RegisterPaymentDto,
  ) {
    return this.paymentsService.registerPayment(dto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get("client/:clientId")
  findPendingMemberships(
    @Param("clientId") clientId: string,
  ) {
  return this.paymentsService.findPendingMemberships(
    Number(clientId),
  );
  }

  @Get("pending")
  findAllPendingMemberships() {

    return this.paymentsService.findAllPendingMemberships();

  }

}