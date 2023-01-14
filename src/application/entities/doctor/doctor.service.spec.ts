import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialtyService } from '../specialties/specialty.service';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

describe('DoctorService', () => {
  let service: DoctorService;
  let specialtyService: SpecialtyService;
  let doctorRepository: Repository<Doctor>;

  const DOCTOR_REPOSITORY_TOKEN = getRepositoryToken(Doctor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService, 
        {
          provide: DOCTOR_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            update: jest.fn(),
            save: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get<Repository<Doctor>>(DOCTOR_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('DoctorRepository should be defined', () => {
    expect(doctorRepository).toBeDefined();
  });

  describe('Register doctor', () => {
    it('Should sucessfully register a doctor with valid credentials', async () => {
      const doctor:CreateDoctorDto = {
        name: "Almeida",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      await service.insert(doctor);

      expect(doctorRepository.save).toBeCalled();
    });

    it('Should fail to register a doctor with invalid credentials', async () => {
      const doctor:CreateDoctorDto = {
        name: "Almeida",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "00000000",
        specialties: [1,2]
      }

      expect(service.insert(doctor)).rejects.toThrowError(NotFoundException);
    })

    it('Should sucessfully update doctor info', async () => {

      jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(():any => {
        return {};
      });

      jest.spyOn(service, 'getDoctorById').mockImplementationOnce(():any => {
        return {};
      });

      await service.updateData({}, 1, specialtyService);

      expect(doctorRepository.update).toBeCalled();
    });

    describe('Get doctors', () => {
      it('Should return an array with all registered and active doctors', async () => {

        jest.spyOn(doctorRepository, 'find').mockImplementationOnce(():any => {
          return [];
        });

        await service.getAllDoctors(specialtyService);

        expect(doctorRepository.find).toBeCalled();
      });

      it('Should return doctor by given id', async () => {
        jest.spyOn(doctorRepository, 'findBy').mockImplementationOnce(():any => {
          return [];
        });

        await service.getDoctorById(1, specialtyService);

        expect(doctorRepository.findBy).toBeCalled();
      });

      it('Should return doctor by given query filters', async () => {
        jest.spyOn(doctorRepository, 'findBy').mockImplementationOnce(():any => {
          return [];
        });

        await service.getDoctorByFilters({}, specialtyService);

        expect(doctorRepository.findBy).toBeCalled();
      });
    })

    describe('Soft Delete a doctor', () => {
      it('Should successfuly deactive a registered doctor', async () => {

        jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(():any => {
          return {};
        });

        await service.delete(1);

        expect(doctorRepository.update).toBeCalled();
      });

      it('Should successfuly active a soft deleted doctor', async () => {

        jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(():any => {
          return {};
        });

        await service.enableDoctor(1);

        expect(doctorRepository.update).toBeCalled();
      });
    });
  })
});