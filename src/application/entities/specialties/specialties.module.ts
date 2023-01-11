import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyController } from './specialties.controller';
import { Specialty } from './specialty.entity';
import { SpecialtyService } from './specialty.service';

@Module({
  imports:[TypeOrmModule.forFeature([Specialty])],
  controllers:[SpecialtyController],
  providers:[SpecialtyService],
  exports:[SpecialtyService]
})
export class specialtyModule{}
