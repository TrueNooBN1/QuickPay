import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  JoinColumn,
} from 'typeorm';

//todo many to one

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;

  @Column({ name: 'filmId' }) //many to one
  @JoinColumn()
  filmId: string;

  @Column()
  daytime: Date;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column('simple-array')
  taken: string[];
}
