import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { CashModule } from '../cash/cash.module';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [
    PrismaModule,
    CashModule,
    FinancialModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
