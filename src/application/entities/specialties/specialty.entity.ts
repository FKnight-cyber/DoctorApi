import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, length: 120 })
  name: string;

  @Column("int", { array: true})
  doctors: number[];
}