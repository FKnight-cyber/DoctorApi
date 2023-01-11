import { Module } from '@nestjs/common';
import { doctorModule } from './application/entities/doctor/doctor.module';
import { SpecialtiesModule } from './application/entities/specialties/specialties.module';
import { DatabaseModule } from './infra/database/database.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    doctorModule, 
    SpecialtiesModule, DatabaseModule,
  ],
})
export class AppModule {}
