import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';
// import { Schedule } from './schedule.entity';

@Entity('adminData')
export class AdminDataEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  value: string;
}
