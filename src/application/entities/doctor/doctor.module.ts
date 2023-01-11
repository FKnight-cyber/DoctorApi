import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';

@Module({
  imports:[TypeOrmModule.forFeature([Doctor])],
  controllers:[DoctorController],
  providers:[DoctorService]
})
export class doctorModule{}