import { Controller, Get, Post } from "@nestjs/common";
import { SpecialtyService } from "./specialty.service";

@Controller('specialties')
export class SpecialtyController {
  constructor(private specialtyService: SpecialtyService){}

  @Get()
  specialtiesData() {
    return this.specialtyService.getRegisteredSpecialties();
  }

  @Post('seed')
  async seedDB() {
    await this.specialtyService.seed();

    return "Specialties added!";
  }
}