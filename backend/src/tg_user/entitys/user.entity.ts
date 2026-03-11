import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { UserRole } from '../dto/get-user.dto';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("text", { array: true,default: [UserRole.USER]})
  roles: UserRole[];

  // можно добавить refreshTokenHash если храним в БД
  @Column({ nullable: true })
  refreshToken?: string; // хранить захешированный refresh token
}