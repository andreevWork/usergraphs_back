import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  static saltSeparator = '___';

  createPassword(rawPassword: string, salt: string = crypto.randomBytes(16).toString('hex')): string {
    return [
      crypto.pbkdf2Sync(rawPassword, salt, 1000, 64, `sha512`).toString(`hex`),
      salt
    ].join(PasswordService.saltSeparator);
  }

  checkPassword(rawPassword: string, hashedPassword: string): boolean {
    const [_, salt] = hashedPassword.split(PasswordService.saltSeparator);

    return this.createPassword(rawPassword, salt) === hashedPassword;
  }
}
