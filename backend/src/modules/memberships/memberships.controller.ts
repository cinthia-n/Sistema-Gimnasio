import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { MembershipsService } from './memberships.service';
import { RegisterMembershipDto } from './dto/register-membership.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
  ) {}

  @Post('register')
  register(
    @Body() dto: RegisterMembershipDto,
  ) {
    return this.membershipsService.register(dto);
  }

  @Get('code/:code')
  findByCode(
    @Param('code') code: string,
  ) {
    return this.membershipsService.findByCode(code);
  }

  @Get()
  findAll(){
    return this.membershipsService.findAll();
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { reason: string },
    @Req() req: any,
  ) {
      return this.membershipsService.cancel(id, req.user.sub, req.user.role, dto.reason);
  }

}