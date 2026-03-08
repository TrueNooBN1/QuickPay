import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Schedule } from './schedule.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  wallet: string;

  @Column()
  status: string;

  @Column()
  totalSum: number;

  @Column()
  exchangeRate: number;

  @Column()
  exchangeValue: number;

  @Column()
  type: string;

  @Column()
  createdAt: Date;

  // @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  // schedule: Schedule;
}
