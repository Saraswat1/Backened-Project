import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/v1/doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.doctorService.findAllDoctors(query);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.doctorService.findDoctorById(id);
  }

  @Post(':id/availability')
  @UseGuards(AuthGuard('jwt'))
  createAvailability(
    @Param('id') id: number,
    @Body() dto: CreateAvailabilityDto,
    @Req() req: Request
  ) {
    return this.doctorService.createAvailability(id, dto);
  }
}
