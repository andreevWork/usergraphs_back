import { Strategy } from 'passport-cookie';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserRedis } from '../user.entity';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      cookieName: 'token',
    });
  }

  async validate(token: string): Promise<UserRedis> {
    const user = await this.userService.getUserFromRedis(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
