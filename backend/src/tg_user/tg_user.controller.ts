import { Controller, Get, Put, Delete, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UserService } from './tg_user.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { UpdateUserDTO, UserRole } from './dto/update-user-dto';
import { User } from 'src/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получить профиль текущего пользователя
  @Get('profile')
  async getProfile(
    @User() user
  ) {
    const userId = user.userId; // из payload JWT
    return this.userService.findById(userId);
  }

  // Получить пользователя по ID (только для самого пользователя или администратора)
  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @User() user
  ) {
    const currentUserId = user.userId;

    if (currentUserId !== id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.userService.findById(id);
  }

  // Обновить пользователя
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
    @User() user
  ) {
    const currentUserId = user.userId;

    if (currentUserId !== id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userService.updateTelegramUser(id, updateUserDto);
  }

  // // Удалить пользователя
  // @Delete(':id')
  // async deleteUser(
  //   @Param('id') id: string, 
  //   @User() user
  // ) {
  //   const currentUserId = user.userId;
    
  //   if (currentUserId !== id && user.role !== UserRole.ADMIN) {
  //     throw new ForbiddenException('You can only delete your own profile');
  //   }

  //   await this.userService.remove(id);
  //   return { message: 'User deleted successfully' };
  // }
}