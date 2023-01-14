import { faker } from '@faker-js/faker';

export default async function __doctorFactory(){
    return {
      name: faker.name.fullName(),
      crm: faker.random.numeric(7).toString(),
      telefoneFixo: faker.random.numeric(12).toString(),
      telefoneCelular: faker.random.numeric(12).toString(),
      specialties: [1,2]
    }
}