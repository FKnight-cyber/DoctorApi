import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, length: 120 })
  name: string;

  @Column({unique: true, type: 'bigint'})
  crm: number;

  @Column({type: 'bigint'})
  telefoneFixo: number;

  @Column({type: 'bigint'})
  telefoneCelular: number;

  @Column({type: 'bigint'})
  cep: number;

  @Column("int", { array: true})
  specialties: number[];
}