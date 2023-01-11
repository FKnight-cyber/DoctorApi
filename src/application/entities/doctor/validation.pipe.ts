import { PipeTransform, BadRequestException } from '@nestjs/common';

import { CreateDoctorDto } from './dto/create-doctor.dto';

import { DoctorSchema } from './dto/doctor.dto';

export class CreateDoctorValidatorPipe implements PipeTransform<CreateDoctorDto> {
  public transform(value: CreateDoctorDto): CreateDoctorDto {
    const result = DoctorSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}