import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { Specialty } from "../specialties/specialty.entity";
import { Doctor } from "./doctor.entity";
import { CreateDoctorDto } from "./dto/create-doctor.dto";

@Injectable({})
export class DoctorService{
  constructor(@InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>){}
  async insert(CreateDoctorDto: CreateDoctorDto){

    const checkCEP = await axios.get(`http://viacep.com.br/ws/${CreateDoctorDto.cep}/json/`);

    if(checkCEP.data.erro) {
      throw new NotFoundException('Invalid cep!', { cause: new Error(), description: "Couldn't find your cep info" })
    }

    try {
      const doctor = await this.doctorRepository.save({
        name: CreateDoctorDto.name,
        crm: parseInt(CreateDoctorDto.crm),
        telefoneFixo: parseInt(CreateDoctorDto.telefoneFixo),
        telefoneCelular: parseInt(CreateDoctorDto.telefoneCelular),
        cep: parseInt(CreateDoctorDto.cep),
        specialties: CreateDoctorDto.specialties
      });

      return doctor;

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Doctor info already registered!',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  update() {
    
  }

  async getAllDoctors() {
   return await this.doctorRepository.find();
  }

  async getDoctorById(id: number) {

    try {
      return await this.doctorRepository.findBy({id});
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "There's no doctor registered with this id!",
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }

  }

  async getDoctorByFilters(query: any) {
    if(query.cep) {
      const doctor = this.doctorRepository.findBy({cep:query.cep});
    }
    return this.doctorRepository.findBy(query);
  }

  async getDoctorByCrm(crm: number) {
    return this.doctorRepository.findBy({crm});
  }

  delete() {
    
  }
}

function fixQueryArray(numbers: string) {
  const arr:any = numbers.split(',')
  for(let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(arr[i]);
  }
  return arr;
}