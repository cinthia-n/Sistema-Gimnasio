import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';

import { ReportsService } from './reports.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

function parseStartOfDay(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function parseEndOfDay(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
}

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {

    constructor(
        private readonly reportsService: ReportsService,
    ) {}

    @Get('sales')
    sales(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.reportsService.sales(
            parseStartOfDay(startDate),
            parseEndOfDay(endDate),
        );
    }

    @Get('purchases')
    purchases(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.reportsService.purchases(
            parseStartOfDay(startDate),
            parseEndOfDay(endDate),
        );
    }

    @Get('enrollments')
    enrollments(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.reportsService.enrollments(
            parseStartOfDay(startDate),
            parseEndOfDay(endDate),
        );
    }

    @Get('cash')
    cash(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.reportsService.cash(
            parseStartOfDay(startDate),
            parseEndOfDay(endDate),
        );
    }
}