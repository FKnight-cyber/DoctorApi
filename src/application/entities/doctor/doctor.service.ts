import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { SpecialtyService } from "../specialties/specialty.service";
import { Doctor } from "./doctor.entity";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";

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

  async updateData(UpdateDoctorDto: UpdateDoctorDto, id:number, service:SpecialtyService) {
    const doctor = await this.doctorRepository.findOne({where:{id}});

    if(UpdateDoctorDto.cep) {
      const checkCEP = await axios.get(`http://viacep.com.br/ws/${UpdateDoctorDto.cep}/json/`);
      
      if(checkCEP.data.erro) {
        throw new NotFoundException('Invalid cep!', { cause: new Error(), description: "Couldn't find your cep info" })
      }
    }

    doctor.name = UpdateDoctorDto.name ? UpdateDoctorDto.name : doctor.name;
    doctor.crm = UpdateDoctorDto.crm ? parseInt(UpdateDoctorDto.crm) : doctor.crm;
    doctor.cep = UpdateDoctorDto.cep ? parseInt(UpdateDoctorDto.cep) : doctor.cep;
    doctor.telefoneFixo = UpdateDoctorDto.telefoneFixo ? parseInt(UpdateDoctorDto.telefoneFixo) : doctor.telefoneFixo;
    doctor.telefoneCelular = UpdateDoctorDto.telefoneCelular ? parseInt(UpdateDoctorDto.telefoneCelular) : doctor.telefoneCelular;
    doctor.specialties = UpdateDoctorDto.specialties ? UpdateDoctorDto.specialties : doctor.specialties;

    await this.doctorRepository.update(id, doctor);

    if(UpdateDoctorDto.specialties) {
      await service.addDoctorToSpecialties(id, UpdateDoctorDto.specialties);
    }
    
    return await this.getDoctorById(id, service);
  }

  async getAllDoctors(service: SpecialtyService) {
    const doctors = await this.doctorRepository.find();
    return await getSpecialtiesNames(doctors, service);
  }

  async getDoctorById(id: number, service:SpecialtyService) {

    try {
      const doctor = await this.doctorRepository.findBy({id});

      return await getSpecialtiesNames(doctor, service);

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "There's no doctor registered with this id!",
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }

  }

  async getDoctorByFilters(query: any, service:SpecialtyService) {
    if(query.cep) {
      const doctors = await this.doctorRepository.findBy({cep:query.cep});

      const addSpecialtiesNames = await getSpecialtiesNames(doctors, service);

      return await addAddressInfo(addSpecialtiesNames);
    }

    if(query.specialties) {
      query.specialties = fixQueryArray(query.specialties);

      const doctors = await this.doctorRepository.createQueryBuilder('doctors')
      .where('doctors.specialties @> :specialties', { specialties:query.specialties}).getMany();

      return await getSpecialtiesNames(doctors, service);
    }

    const doctors = await this.doctorRepository.findBy(query);
    return await getSpecialtiesNames(doctors, service);
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

async function getSpecialtiesNames(doctors:Doctor[], service:SpecialtyService) {
  const result = [];

  for(const doctor of doctors) {
    const specialtiesName = [];
    for(let i = 0; i < doctor.specialties.length; i++) {
      const specialty = (await service.getSpecialtyById(doctor.specialties[i])).name;
      specialtiesName.push(specialty)
    }
    result.push({...doctor, specialties: specialtiesName});
  }

  return result;
}

async function addAddressInfo(doctors:Doctor[]) {
  const result = [];
  for(const doctor of doctors) {
    const addressInfo = (await axios.get(`http://viacep.com.br/ws/${doctor.cep}/json/`)).data;
    delete doctor["cep"];
    result.push({...doctor, address:addressInfo});
  }
  return result;
}