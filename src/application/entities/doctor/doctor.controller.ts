import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { SpecialtyService } from "../specialties/specialty.service";
import { DoctorService } from "./doctor.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { CreateDoctorValidatorPipe, UpdateDoctorValidatorPipe } from "./validation.pipe";

@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService, private specialtyService: SpecialtyService){}

  @Post('add')
  async insert(@Body(new CreateDoctorValidatorPipe) CreateDoctorDto: CreateDoctorDto) {
    
    const doctor = await this.doctorService.insert(CreateDoctorDto);
    
    await this.specialtyService.addDoctorToSpecialties(doctor.id, doctor.specialties);

    return "Doctor sucessfully registered!"
  }

  @Patch('update/:id')
  async updateDoctorInfo(@Body(new UpdateDoctorValidatorPipe) UpdateDoctorDto: UpdateDoctorDto, @Param('id') id: number){
    const service = this.specialtyService;
    return await this.doctorService.updateData(UpdateDoctorDto, id, service);
  }

  @Patch('delete/:id')
  async deactivateDoctor(@Param('id') id: number) {
    await this.doctorService.delete(Number(id));
    return "Doctor deactivated from system!";
  }

  @Patch('activate/:id')
  async activateDoctor(@Param('id') id: number) {
    await this.doctorService.enableDoctor(Number(id));
    return "Doctor active!";
  }

  @Get()
  findAllDoctors(@Query() query: {
    name:string, 
    crm:number, 
    telefoneFixo:number, 
    telefoneCelular:number,
    cep:number,
    specialties: number[]
  }){
    const service = this.specialtyService;

    if(Object.keys(query).length !== 0) {
      return this.doctorService.getDoctorByFilters(query, service);
    }

    return this.doctorService.getAllDoctors(service);
  }

  @Get('/:id')
  findDoctorById(@Param('id') id: number){
    const service = this.specialtyService;
    return this.doctorService.getDoctorById(id, service);
  }

  @Delete('remove')
  delete(){
    return 'delete route';
  }
}