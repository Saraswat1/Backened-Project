import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { DoctorService } from './doctor.service';

@Controller('api/v1/doctors')
export class DoctorAvailabilityController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/availability')
  async createAvailability(
    @Param('id', ParseIntPipe) doctorId: number,
    @Body() dto: CreateAvailabilityDto
  ) {
    return this.doctorService.createAvailability(doctorId, dto);
  }
}
