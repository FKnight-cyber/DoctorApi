import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { specialtyModule } from '../specialties/specialties.module';
import { Specialty } from '../specialties/specialty.entity';
import { DoctorController } from './doctor.controller';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';

@Module({
  imports:[TypeOrmModule.forFeature([Doctor, Specialty]), specialtyModule],
  controllers:[DoctorController],
  providers:[DoctorService]
})
export class doctorModule{}