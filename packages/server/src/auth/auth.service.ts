import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@fullstack/typings';
import { UserService } from '../user/user.service';
import { ValidateResult, JWTSignPayload, JWTSignResult } from '../typings';
import bcrypt from 'bcrypt';
import { FastifyCookieOptions } from 'fastify-cookie';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<ValidateResult> {
    const user = await this.userService.findOne({ username }, '+password');

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);

      if (valid) {
        return user;
      }

      throw new BadRequestException('Incorrect Password');
    } else {
      const admin = await this.userService.findAll({ role: UserRole.ADMIN });

      if (!admin.length) {
        const [defaultUsername, defaultPassword] = [
          'DEFAULT_USERNAME',
          'DEFAULT_PASSWORD'
        ].map(this.configService.get);

        if (username === defaultUsername && pass === defaultPassword) {
          return {
            id: defaultUsername,
            username: defaultUsername,
            role: UserRole.ADMIN
          };
        }
      }
    }

    throw new BadRequestException('User Not Found');
  }

  signJwt({ id, username, role }: JWTSignPayload): JWTSignResult {
    const now = +new Date();
    const payload: JWTSignPayload = { id, role, username };
    return {
      token: this.jwtService.sign({
        ...payload,
        iat: now
      }),
      expiry: new Date(
        now +
          Number(this.configService.get<string>('JWT_TOKEN_EXPIRES')) *
            60 *
            1000
      )
    };
  }

  getTokenCookieOps(): FastifyCookieOptions {
    return {
      maxAge:
        Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRES')) *
        60 *
        1000,
      httpOnly: true,
      secure: false
    };
  }

  async login(user: JWTSignPayload): Promise<JWTSignResult> {
    return this.signJwt(user);
  }
}
