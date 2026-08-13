import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AttendanceService } from './attendance.service';
import { CheckinDto } from './dto/checkin.dto';
import { Param, Get } from '@nestjs/common';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post('checkin')
  checkin(
    @Body() dto: CheckinDto,
  ) {
    return this.attendanceService.checkin(dto);
  }

  @Get('history/:membershipCode')
    history(
    @Param('membershipCode')
     membershipCode: string,
    ) {
        return this.attendanceService.history(
         membershipCode,
    );
    }

    @Get('today')
    today() {
    return this.attendanceService.today();
    }

    @Get('today/count')
    todayCount() {
    return this.attendanceService.todayCount();
    }
}