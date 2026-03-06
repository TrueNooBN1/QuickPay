import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column()
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  schedule: Schedule;
}
