import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from './specialty.entity';
import { SpecialtyService } from './specialty.service';

describe('SpecialtyService', () => {
  let service: SpecialtyService;
  let specialtyRepository: Repository<Specialty>;

  const SPECIALTY_REPOSITORY_TOKEN = getRepositoryToken(Specialty);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialtyService, 
        {
          provide: SPECIALTY_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            save: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<SpecialtyService>(SpecialtyService);
    specialtyRepository = module.get<Repository<Specialty>>(SPECIALTY_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('SpecialtyRepository should be defined', () => {
    expect(specialtyRepository).toBeDefined();
  });

  describe('Seed specialties', () => {
    it('Should create 8 specialties', async () => {
      await service.seed();

      expect(specialtyRepository.save).toBeCalledTimes(8);
    });
  });

  describe('Find specialties', () => {
    it('Should return all registeres specialties', async () => {
      await service.getRegisteredSpecialties();
  
      expect(specialtyRepository.find).toBeCalled();
    });
    
    it('Should return specialty by given id', async () => {
      await service.getSpecialtyById(3);

      expect(specialtyRepository.findOne).toHaveBeenCalledWith({where:{id:3}});
    });
  });

  describe('Manipulate doctors specialties', () => {
    it("Should register a new doctor's specialties", async () => {

      jest.spyOn(specialtyRepository, 'find').mockImplementationOnce(():any => {
        return specialties;
      });

      jest.spyOn(specialtyRepository, 'findOne').mockImplementationOnce(():any => {
        return {
          id:1,
          name:"Alergologia",
          doctors: []
        };
      });

      jest.spyOn(specialtyRepository, 'findOne').mockImplementationOnce(():any => {
        return {
          id:2,
          name:"Angiologia",
          doctors: []
        };
      });
      
      await service.addDoctorToSpecialties(2, [1,2]);

      expect(specialtyRepository.save).toHaveBeenCalled();
    });
  })
});

const specialties = [
  {
    id:1,
    name:"Alergologia",
    doctors: []
  },
  {
    id:2,
    name:"Angiologia",
    doctors: []
  },
  {
    id:3,
    name:"Buco maxilo",
    doctors: []
  },
  {
    id:4,
    name:"Cardiologia clínica",
    doctors: []
  },
  {
    id:5,
    name:"Cardiologia infantil",
    doctors: []
  },
  {
    id:6,
    name:"Cirurgia cabeça e pescoço",
    doctors: []
  },
  {
    id:7,
    name:"Cirurgia cardíaca",
    doctors: []
  },
  {
    id:8,
    name:"Cirurgia de tórax",
    doctors: []
  },
];