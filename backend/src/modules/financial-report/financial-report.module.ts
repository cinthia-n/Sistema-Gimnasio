import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { FinancialReportService } from './financial-report.service';

@Module({
  imports: [PrismaModule],
  providers: [FinancialReportService],
  exports: [FinancialReportService],
})
export class FinancialReportModule {}