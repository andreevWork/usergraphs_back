import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from './auth/password.service';
import { LocalStrategy } from './auth/local.strategy';
import { CookieStrategy } from './auth/cookie.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, PasswordService, LocalStrategy, CookieStrategy],
})
export class UserModule {}
