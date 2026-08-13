import { Module } from '@nestjs/common';

import { CashModule } from '../cash/cash.module';

import { FinancialService } from './financial.service';

@Module({
  imports: [CashModule],
  providers: [FinancialService],
  exports: [FinancialService],
})
export class FinancialModule {}