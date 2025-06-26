import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './doctor.entity';
import { DoctorAvailability } from './doctor_availability.entity';
import { DoctorTimeSlot } from './doctor_time_slot.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,

    @InjectRepository(DoctorTimeSlot)
    private timeSlotRepo: Repository<DoctorTimeSlot>
  ) {}

  async createAvailability(
    doctorId: number,
    dto: CreateAvailabilityDto
  ): Promise<DoctorAvailability> {
    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) throw new Error('Doctor not found');

    const availability = this.availabilityRepo.create({
      date: dto.date,
      start_time: dto.start_time,
      end_time: dto.end_time,
      weekdays: dto.weekdays,
      session: dto.session,
      doctor: doctor,
    });
    const savedAvailability = await this.availabilityRepo.save(availability);

    // Generate slots
    const slots = [];
    const start = new Date(`1970-01-01T${dto.start_time}:00Z`);
    const end = new Date(`1970-01-01T${dto.end_time}:00Z`);
    const slotDuration = dto.slot_duration; // in minutes

    while (start < end) {
      const next = new Date(start.getTime() + slotDuration * 60000);
      if (next > end) break;
      slots.push(
        this.timeSlotRepo.create({
          availability: { id: savedAvailability.id },
          start_time: start.toTimeString().slice(0, 5),
          end_time: next.toTimeString().slice(0, 5),
        })
      );
      start.setTime(next.getTime());
    }

    savedAvailability.slots = await this.timeSlotRepo.save(slots);
    return savedAvailability;
  }

  async findAllDoctors(query?: { name?: string; specialization?: string }) {
    const where: any = {};
    if (query?.name) where.name = Like(`%${query.name}%`);
    if (query?.specialization) where.specialization = Like(`%${query.specialization}%`);
    return this.doctorRepo.find({ where });
  }

  async findDoctorById(id: number) {
    return this.doctorRepo.findOne({ where: { id } });
  }
}
