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
  initDataStr: string,
  botToken: string,
): boolean {

    const initData = new URLSearchParams(initDataStr);

    // 2. Извлекаем хеш и удаляем его из списка
    const hash = initData.get('hash');
    // initData.delete('hash');
    // console.log(initData)
    // console.log(initData.get("user")])

    // 3. Сортируем оставшиеся параметры (включая signature!) по алфавиту
    const sortedParams = Array.from(initData.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    // 4. Формируем строку для проверки: "key=value\nkey=value..."
    const dataCheckString = Array.from(initData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
    // 5. Создаем секретный ключ из токена бота
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest('hex');

    // 6. Вычисляем HMAC-SHA256 из dataCheckString с помощью secretKey
    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    console.log(computedHash, hash)
    // 7. Сравниваем вычисленный хеш с тем, что прислал Telegram
    if (computedHash === hash) {
      // Данные подлинные, пользователь авторизован
      
    }

    return true;
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

  async validateUser(telegramId: string, initDataStr: string): Promise<GetUserDTO | null> {
    if(telegramId === 'undefined')
      throw new UnauthorizedException();

     const token = this.config.botToken;
     console.log(token)
   if(!verifyTelegramInitData(initDataStr, token)){
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
  

