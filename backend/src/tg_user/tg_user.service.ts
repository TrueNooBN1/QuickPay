import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entitys/user.entity';
import { UpdateUserDTO } from './dto/update-user-dto';
import * as bcrypt from 'bcrypt-ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByTelegramId(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { telegramId: id } });
  }
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  
  async createTelegramUser(id: string): Promise<User> {
    const existing = await this.findByTelegramId(id);
    if (existing) {
      throw new ConflictException('id');
    }
    const user = this.userRepository.create({
      telegramId: id,
    });
    return this.userRepository.save(user);
  }

  async updateTelegramUser(id: string, updateDto: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, updateDto);
    return this.userRepository.save(user);
    
  }

  async setRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    // В реальном проекте храните хеш refresh токена
    user.refreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.userRepository.save(user);
  }

  async getUserIfRefreshTokenMatches(id: string, refreshToken: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user || !user.refreshToken) return null;
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatch ? user : null;
  }
}


  // async findByEmail(email: string): Promise<User | null> {
  //   return this.userRepository.findOne({ where: { email } });
  // }

  // async createUser(email: string, password: string, name?: string): Promise<User> {
  //   const existing = await this.findByEmail(email);
  //   if (existing) {
  //     throw new ConflictException('Email already exists');
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = this.userRepository.create({
  //     email,
  //     password: hashedPassword,
  //     name,
  //   });
  //   return this.userRepository.save(user);
  // }

  
  // async updateUser(id: string, updateDto: UpdateUserDTO): Promise<User> {
  //   const user = await this.findById(id);
  //   if (!user) throw new NotFoundException('User not found');
  //   Object.assign(user, updateDto);
  //   if (updateDto.password) {
  //     user.password = await bcrypt.hash(updateDto.password, 10);
  //   }
  //   return this.userRepository.save(user);
  // }
  

