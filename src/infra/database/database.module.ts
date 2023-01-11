import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/application/entities/doctor/doctor.entity';
import { Specialty } from 'src/application/entities/specialties/specialty.entity';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: process.env.POSTGRES_DB,
      entities:[Doctor, Specialty],
      synchronize:true,
    })
  ]
})
export class DatabaseModule {}
