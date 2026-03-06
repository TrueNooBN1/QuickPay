import { IsArray, isArray } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  telegramId: string;

  // @Column({ unique: true })
  // email: string;

  // @Column()
  // password: string; // хеш

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  wallet: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsArray()
  roles: string[];

  // можно добавить refreshTokenHash если храним в БД
  @Column({ nullable: true })
  refreshToken?: string; // хранить захешированный refresh token
}