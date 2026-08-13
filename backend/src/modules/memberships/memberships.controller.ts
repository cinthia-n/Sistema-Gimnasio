import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { MembershipsService } from './memberships.service';
import { RegisterMembershipDto } from './dto/register-membership.dto';

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
}