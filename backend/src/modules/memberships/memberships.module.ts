import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { FinancialModule } from '../financial/financial.module';
import { CashModule } from '../cash/cash.module';
@Module({
  imports: [PrismaModule, FinancialModule, CashModule],
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}