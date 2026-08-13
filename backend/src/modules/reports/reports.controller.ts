import {

    Controller,

    Get,

    Query,

} from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')

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

            new Date(startDate),

            new Date(endDate),

        );

    }

    @Get('purchases')

    purchases(

        @Query('startDate') startDate: string,

        @Query('endDate') endDate: string,

    ) {

        return this.reportsService.purchases(

            new Date(startDate),

            new Date(endDate),

        );

    }

    @Get('enrollments')

    enrollments(

        @Query('startDate') startDate: string,

        @Query('endDate') endDate: string,

    ) {

        return this.reportsService.enrollments(

            new Date(startDate),

            new Date(endDate),

        );

    }

    @Get('cash')

    cash(

        @Query('startDate') startDate: string,

        @Query('endDate') endDate: string,

    ) {

        return this.reportsService.cash(

            new Date(startDate),

            new Date(endDate),

        );

    }

}