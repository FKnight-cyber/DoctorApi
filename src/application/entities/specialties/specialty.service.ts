import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Specialty } from "./specialty.entity";

@Injectable({})
export class SpecialtyService{
  constructor(@InjectRepository(Specialty) private readonly specialtyRepository: Repository<Specialty>){}

  async getRegisteredSpecialties() {
    return this.specialtyRepository.find();
  }
  
  async getSpecialtyById(id:number) {
    return this.specialtyRepository.findOne({where:{id}});
  }

  async addDoctorToSpecialties(doctorId:number, specialties:number[]) {
    try {
      for(let i = 0; i < specialties.length; i++) {
        const specialty = await this.specialtyRepository.findOne({where:{id:specialties[i]}});
        specialty.doctors.push(doctorId);
        await this.specialtyRepository.save(specialty);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Failed to add data",
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  async seed() {
    const specialties = [
      {
        name:"Alergologia",
        doctors: []
      },
      {
        name:"Angiologia",
        doctors: []
      },
      {
        name:"Buco maxilo",
        doctors: []
      },
      {
        name:"Cardiologia clínica",
        doctors: []
      },
      {
        name:"Cardiologia infantil",
        doctors: []
      },
      {
        name:"Cirurgia cabeça e pescoço",
        doctors: []
      },
      {
        name:"Cirurgia cardíaca",
        doctors: []
      },
      {
        name:"Cirurgia de tórax",
        doctors: []
      },
    ];

    for(const specialty of specialties) {
      try {
        await this.specialtyRepository.save(specialty);
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: "Failed to add data",
        }, HttpStatus.FORBIDDEN, {
          cause: error
        });
      }
    }
  }
}