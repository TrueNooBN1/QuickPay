import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './tg_user.service';
import { UserController } from './tg_user.controller';
import { UserEntity } from '../tg_user/entitys/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], 
})
export class TelegramUserModule {}