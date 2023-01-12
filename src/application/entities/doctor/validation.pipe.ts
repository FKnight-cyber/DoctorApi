import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorSchema, UpdateSchema } from './dto/doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

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

export class UpdateDoctorValidatorPipe implements PipeTransform<UpdateDoctorDto> {
  public transform(value: UpdateDoctorDto): UpdateDoctorDto {
    const result = UpdateSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}