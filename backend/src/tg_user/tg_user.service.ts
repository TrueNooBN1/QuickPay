import { Injectable, NotFoundException, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entitys/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt-ts';
import { GetUserDTO } from './dto/get-user.dto';
import * as crypto from "crypto";
import { appConfig, IConfig } from 'src/config/app.config';

export function verifyTelegramInitData(
  initData: string,
  botToken: string,
): boolean {

  const params = new URLSearchParams(initData);

  const hash = params.get("hash");
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto
    .createHash("sha256")
    .update(botToken)
    .digest("hex");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(appConfig.KEY)
    private readonly config: IConfig,

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
    // console.log("async findByTelegramId"+ JSON.stringify(user));
    if(user !== null){
    // console.log("async findByTelegramId mapper"+ JSON.stringify(user));
      return this.getUserMapperFn()(user);
    }

    return null;
  }
  async findByUserId(id: string): Promise<GetUserDTO | null> {
    const user =  await this.userRepository.findOne({ where: { id: id } });
    // console.log("async findByUserId(id: string): Promise<GetUserDTO | null>", JSON.stringify(user));
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
    // console.log("createTelegramUser" + JSON.stringify(user) + JSON.stringify(newUser))
    return this.getUserMapperFn()(newUser);

  }

  async updateTelegramUser(id: string, updateDto: UpdateUserDTO): Promise<GetUserDTO> {
    const user = await this.userRepository.findOneBy({id: id});
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, updateDto);
    const updatedUser = await this.userRepository.save(user);
    // console.log(`async updateTelegramUser ${JSON.stringify(updateDto)}`);
    // console.log(`async updateTelegramUser ${JSON.stringify(updatedUser)}`);
    // console.log(`async updateTelegramUser ${JSON.stringify(this.getUserMapperFn()(updatedUser))}`);
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

  async validateUser(telegramId: string, initData: string): Promise<GetUserDTO | null> {
    if(telegramId === 'undefined')
      throw new UnauthorizedException();

    const token = this.config.botToken;
    if(!verifyTelegramInitData(initData, token)){
      throw new UnauthorizedException();
    }
    

    const user = await this.findByTelegramId(telegramId);
    // console.log("validate+" + JSON.stringify(user));
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
  

