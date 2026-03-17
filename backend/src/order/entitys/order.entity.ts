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

  @Column({type:'float'})
  totalSum: number;

  @Column({type:'float'})
  exchangeRate: number;

  @Column({type:'float'})
  exchangeValue: number;

  @Column()
  type: string;

  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
    default: null
  })
  executionRate: number;

  // @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  // schedule: Schedule;
}
