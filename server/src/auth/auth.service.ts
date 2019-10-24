import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config';
import { UserService } from '../user';
import bcrypt from 'bcrypt';
import { JWTSignPayload } from './interfaces/jwt.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

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

  signJwt({ username, role }: JWTSignPayload) {
    const now = +new Date();
    return {
      token: this.jwtService.sign({
        role,
        username,
        iat: now
      }),
      expiry: new Date(
        now + Number(this.configService.get('JWT_TOKEN_EXPIRES')) * 60 * 1000
      )
    };
  }

  async login(user: JWTSignPayload) {
    return this.signJwt(user);
  }
}
