import { Module } from '@nestjs/common';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { PrismaModule } from '../../prisma/prisma.module';

import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [
    PrismaModule,
    FinancialModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
