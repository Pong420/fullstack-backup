import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);

      if (valid) {
        return user;
      }

      throw new BadRequestException('Invalid Password');
    }

    throw new BadRequestException('User Not Found');
  }
}
