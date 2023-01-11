import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { CreateDoctorValidatorPipe } from "./validation.pipe";

@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService){}

  @Post('add')
  insert(@Body(new CreateDoctorValidatorPipe) CreateDoctorDto: CreateDoctorDto) {
    
    return this.doctorService.insert(CreateDoctorDto);
  }

  @Patch('update')
  update(){
    return 'update route';
  }

  @Get()
  findAllDoctors(){
    return this.doctorService.getAllDoctors();
  }

  @Delete('remove')
  delete(){
    return 'delete route';
  }
}