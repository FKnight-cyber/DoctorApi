import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { CreateDoctorDto } from '../src/application/entities/doctor/dto/create-doctor.dto';
import __doctorFactory from './factories/doctorFactory';

describe('App e2e testing', () => {
  let app:INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('(POST) /specialties/seed', () => {
    it('[201::CREATED] Should successfully seed database with specialties', async () => {

      const response = await request(app.getHttpServer()).post('/specialties/seed').send();

      expect(response.statusCode).toEqual(201);
      expect(response.text).toBe("Specialties added!");
    });
  });

  describe('(GET) /specialties', () => {
    it('[200::OK] Should return all registered specialties', async () => {

      const response = await request(app.getHttpServer()).get('/specialties');

      if(response.body.length === 0) {
        await request(app.getHttpServer()).post('/specialties/seed').send();

        const response2 = await request(app.getHttpServer()).get('/specialties');

        expect(response2.body.length).toEqual(8);
      } else {
        expect(response.body.length).toEqual(0);
      }

      expect(response.statusCode).toEqual(200);
    });
  });

  describe('(POST) /doctors/add', () => {
    it('[201::OK] Should successfully register a new doctor', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor:CreateDoctorDto = {
        name: "Almeida",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      const response = await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      expect(response.statusCode).toEqual(201);
      expect(response.text).toBe("Doctor sucessfully registered!");

      const checkDoctor = await request(app.getHttpServer()).get('/doctors').query({ name: 'Almeida' });

      expect(checkDoctor.body[0].name).toEqual(doctor.name);
    });
  });

  describe('(POST) /doctors/add', () => {
    it('[401::UNAUTHORIZED] Should fail to register duplicated doctor', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor:CreateDoctorDto = {
        name: "Almeida",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      const response = await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      expect(response.statusCode).toEqual(401);
      expect(response.body.error).toBe("Doctor info already registered!");
    });
  });

  describe('(GET) /doctors', () => {
    it('[200::OK] Should return all registered doctors', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor1:any = await __doctorFactory();
      doctor1.cep = "60720096";

      const doctor2:any = await __doctorFactory();
      doctor2.cep = "29048690";

      const doctor3:any = await __doctorFactory();
      doctor3.cep = "53416120";

      await request(app.getHttpServer()).post('/doctors/add').send(doctor1);
      await request(app.getHttpServer()).post('/doctors/add').send(doctor2);
      await request(app.getHttpServer()).post('/doctors/add').send(doctor3);

      const response = await request(app.getHttpServer()).get('/doctors').send();

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(3);
    });
  });

  describe('(PATCH) /doctors/update/:id', () => {
    it('[200::OK] Should update registered doctor info', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor:CreateDoctorDto = {
        name: "Aruka",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      const response = await request(app.getHttpServer()).patch('/doctors/update/1').send({
        name: "Aruka Vieira", telefoneFixo: "8532323825"
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body[0].id).toEqual(1);
      expect(response.body[0].name).toEqual("Aruka Vieira");
      expect(response.body[0].telefoneFixo).not.toEqual(doctor.telefoneFixo);
    });
  });

  describe('(PATCH) /doctors/delete/:id', () => {
    it('[200::OK] Should soft delete a registered doctor', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor:CreateDoctorDto = {
        name: "Aruka",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      const response1 = await request(app.getHttpServer()).get('/doctors/1').send();

      expect(response1.body[0].name).toEqual(doctor.name);

      const response2 = await request(app.getHttpServer()).patch('/doctors/delete/1').send();

      expect(response2.statusCode).toEqual(200);
      expect(response2.text).toEqual("Doctor deactivated from system!");
      
      const response3 = await request(app.getHttpServer()).get('/doctors/1').send();

      expect(response3.body.length).toEqual(0);
    });
  });

  describe('(PATCH) /doctors/activate/:id', () => {
    it('[200::OK] Should enable soft deleted doctor', async () => { 
      await request(app.getHttpServer()).post('/specialties/seed').send();

      const doctor:CreateDoctorDto = {
        name: "Aruka",
        crm: "7554443",
        telefoneFixo: "81374098174",
        telefoneCelular: "813298470349",
        cep: "60720096",
        specialties: [1,2]
      }

      await request(app.getHttpServer()).post('/doctors/add').send(doctor);

      await request(app.getHttpServer()).patch('/doctors/delete/1').send();

      const response1 = await request(app.getHttpServer()).get('/doctors/1').send();

      expect(response1.body.length).toEqual(0);

      const response2 = await request(app.getHttpServer()).patch('/doctors/activate/1').send();

      expect(response2.statusCode).toBe(200);
      expect(response2.text).toEqual("Doctor active!");

      const response3 = await request(app.getHttpServer()).get('/doctors/1').send();

      expect(response3.body.length).toEqual(1);
    });
  });
});
  
  
