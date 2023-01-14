import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../../../src/application/entities/doctor/doctor.entity';
import { Specialty } from '../../../src/application/entities/specialties/specialty.entity';

@Module({
  imports:[
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [Doctor, Specialty],
            synchronize: true,
          }
        }
        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          autoLoadEntities: true,
          entities:[Doctor, Specialty],
          synchronize:true,
        };
      }
    })
  ]
})
export class DatabaseModule {}
