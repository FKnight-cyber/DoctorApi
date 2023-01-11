import { Specialty } from "../../specialties/specialty.entity";

export class CreateDoctorDto {
  public name: string;
  public crm: string;
  public telefoneFixo: string;
  public telefoneCelular: string;
  public cep: string;
  public specialties: number[];
}