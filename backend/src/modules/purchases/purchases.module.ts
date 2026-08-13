import { Module } from '@nestjs/common';

import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

import { PrismaModule } from '../../prisma/prisma.module';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [PrismaModule, FinancialModule,],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}