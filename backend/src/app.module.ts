import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServicesModule } from './modules/services/services.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CashModule } from './modules/cash/cash.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { FinancialModule } from './modules/financial/financial.module';
import { FinancialReportModule } from './modules/financial-report/financial-report.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ServicePricesModule } from './modules/service-price/service-prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ServicesModule,
    MembershipsModule,
    PaymentsModule,
    PromotionsModule,
    ProductsModule,
    SalesModule,
    AttendanceModule,
    DashboardModule,
    CashModule,
    SuppliersModule,
    PurchasesModule,
    FinancialModule,
    FinancialReportModule,
    ReportsModule,
    ServicePricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}