import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt-ts';
import { UserService } from '../tg_user/tg_user.service';
import { TelegramAuthDTO } from './dto/tg_auth.dto';
import { GetUserDTO } from 'src/tg_user/dto/get-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async validateUser(telegramId: string): Promise<any> {
  //   const user = await this.userService.findById(telegramId);
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }


  async login(authDto: TelegramAuthDTO) {
    const user = await this.userService.validateUser(authDto.telegramId, authDto.initData);
    // console.log("validate userId " + JSON.stringify(user));
    if (!user){
    // console.log("async login(authDto: TelegramAuthDTO) + await this.register(authDto)")
      return await this.register(authDto)
      //throw new UnauthorizedException('Invalid credentials');
    }
    // console.log("async login(authDto: TelegramAuthDTO) + this.generateTokens(user)")
    return this.generateTokens(user);
  }

  async register(authDto: TelegramAuthDTO) {
    const user = await this.userService.createTelegramUser(
      authDto.telegramId,
    );
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.getUserIfRefreshTokenMatches(payload.sub, refreshToken);
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUser(id: string) {
    return this.userService.findByUserId(id);
  }

  async updateUser(id: string, updateData: any) {
    return this.userService.updateTelegramUser(id, updateData);
  }

  private generateTokens(user: GetUserDTO) {
    const payload = { sub: user.id, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });
    // Сохраняем refreshToken хеш в БД
    // console.log(JSON.stringify(user) + "user");

    this.userService.setRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user};
  }
}