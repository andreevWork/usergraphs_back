import { Body, Controller, Get, Post, UseGuards, Request, Res, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSignupDto } from './user.dto';
import { User, UserRedis } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post('signup')
  async signup(
    @Body() body: UserSignupDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.userService.createUser(body);

    return this.authUser(user, response);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  login(
    @Request() req: Request & { user: User },
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authUser(req.user, response);
  }

  private async authUser(user: User, response: Response) {
    const token = await this.userService.setUserToRedis({
      name: user.name,
      id: user.id
    });

    response.cookie('token', token, { maxAge: 60 * 60 * 60, httpOnly: true });
  }

  @Get('all')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('profile')
  profile(@Request() req: Request & { user: UserRedis }) {
    return req.user;
  }
}
