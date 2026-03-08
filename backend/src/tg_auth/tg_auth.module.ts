import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './tg_auth.service';
import { AuthController } from './tg_auth.controller';
import { UserEntity } from '../tg_user/entitys/user.entity';
import { UserService } from '../tg_user/tg_user.service';
import { JwtStrategy } from '../startegy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // регистрируем репозиторий User
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService, UserService], // экспортируем, если понадобятся в других модулях
})
export class TelegramAuthModule {}