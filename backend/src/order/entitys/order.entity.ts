import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Schedule } from './schedule.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
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
  amount: string;

  @Column()
  type: string;

  @Column()
  createdAt: Date;

  // @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  // schedule: Schedule;
}
