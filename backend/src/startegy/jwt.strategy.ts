import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../tg_user/tg_user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByUserId(payload.sub);
    // console.log("private generateTokens(user: GetUserDTO)", payload)
    // console.log("private generateTokens(user: GetUserDTO) user", user)

    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, roles: payload.roles };
  }
}