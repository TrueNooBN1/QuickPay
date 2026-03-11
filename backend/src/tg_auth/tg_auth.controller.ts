import { Controller, Post, Body, UseGuards, Get, Req, Patch } from '@nestjs/common';
import { AuthService } from './tg_auth.service';
import { RefreshDTO, TelegramAuthDTO } from './dto/tg_auth.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: TelegramAuthDTO) {
    return this.authService.register(registerDto);
  }

  @Post('tg_login')
  async login(@Body() loginDto: TelegramAuthDTO) {
    // console.log("login dto:    "+ JSON.stringify(loginDto));
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDTO) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() user: any) {
    return this.authService.getUser(user.userId);
  }

  @Patch('user')
  @UseGuards(JwtAuthGuard)
  async updateMe(@User() user: any, @Body() updateData: any) {
    return this.authService.updateUser(user.userId, updateData);
  }
}