import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [PrismaModule, FinancialModule],
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}