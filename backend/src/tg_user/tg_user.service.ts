import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entitys/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt-ts';
import { GetUserDTO } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

    private getUserMapperFn(): (User) => GetUserDTO {
      return (root) => {
        return {
          id: root.id,
          telegramId: root.userId,
          name: root.name,
          phone: root.phone,
          wallet: root.wallet,
          roles: root.roles
        };
      };
    }
  

  async findByTelegramId(id: string): Promise<GetUserDTO | null> {
    const user = await this.userRepository.findOne({ where: { telegramId: id } });
    console.log("async findByTelegramId"+ JSON.stringify(user));
    if(user !== null){
    console.log("async findByTelegramId mapper"+ JSON.stringify(user));
      return this.getUserMapperFn()(user);
    }

    return null;
  }
  async findByUserId(id: string): Promise<GetUserDTO | null> {
    const user =  await this.userRepository.findOne({ where: { id: id } });
    return this.getUserMapperFn()(user);
  }
  
  async createTelegramUser(id: string): Promise<GetUserDTO> {
    const existing = await this.findByTelegramId(id);
    if (existing) {
      throw new ConflictException('telegramId');
    }
    const user = this.userRepository.create({
      telegramId: id,
    });

    const newUser =  await this.userRepository.save(user);
    console.log("createTelegramUser" + JSON.stringify(user) + JSON.stringify(newUser))
    return this.getUserMapperFn()(newUser);

  }

  async updateTelegramUser(id: string, updateDto: UpdateUserDTO): Promise<GetUserDTO> {
    const user = await this.userRepository.findOneBy({id: id});
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, updateDto);
    const updatedUser = await this.userRepository.save(user);
    console.log(`async updateTelegramUser ${JSON.stringify(updateDto)}`);
    console.log(`async updateTelegramUser ${JSON.stringify(updatedUser)}`);
    console.log(`async updateTelegramUser ${JSON.stringify(this.getUserMapperFn()(updatedUser))}`);
    return this.getUserMapperFn()(updatedUser);  
  }

  async setRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const user = await this.userRepository.findOneBy({id: id});
    if (!user) throw new NotFoundException('User not found');
    // В реальном проекте храните хеш refresh токена
    user.refreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.userRepository.save(user);
  }

  async getUserIfRefreshTokenMatches(id: string, refreshToken: string): Promise<GetUserDTO | null> {
    const user = await this.userRepository.findOneBy({id: id});
    if (!user || !user.refreshToken) return null;
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatch ? this.getUserMapperFn()(user) : null;
  }

  async validateUser(telegramId: string): Promise<GetUserDTO | null> {
    const user = await this.findByTelegramId(telegramId);
    console.log("validate+" + JSON.stringify(user));
    return user;
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
  

