import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, JWTSignPayload, JWTSignResult } from '@fullstack/typings';
import { FastifyCookieOptions } from 'fastify-cookie';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { formatJWTSignPayload } from './dto/jwt-sign.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(username: string, pass: string): Promise<JWTSignPayload> {
    const user = await this.userService.findOne({ username }, '+password');

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);
      const { id: user_id, ...rest } = user.toJSON();

      if (valid) {
        return formatJWTSignPayload({ user_id, ...rest });
      }

      throw new BadRequestException('Incorrect Password');
    } else {
      const admin = await this.userService.findOne({ role: UserRole.ADMIN });

      if (!admin) {
        const [defaultUsername, defaultPassword] = [
          'DEFAULT_USERNAME',
          'DEFAULT_PASSWORD'
        ].map(k => this.configService.get(k));

        if (username === defaultUsername && pass === defaultPassword) {
          return {
            user_id: defaultUsername,
            username: defaultUsername,
            nickname: defaultUsername,
            role: UserRole.ADMIN
          };
        }
      }
    }

    throw new BadRequestException('User Not Found');
  }

  signJwt(payload: JWTSignPayload): JWTSignResult {
    const now = +new Date();
    const signPayload = formatJWTSignPayload(payload);
    return {
      token: this.jwtService.sign(signPayload),
      expiry: new Date(
        now +
          this.configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') *
            60 *
            1000
      )
    };
  }

  getTokenCookieOps(): FastifyCookieOptions {
    return {
      maxAge:
        Number(
          this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES')
        ) *
        60 *
        1000,
      httpOnly: true,
      secure: false
    };
  }

  async login(user: JWTSignPayload): Promise<JWTSignResult> {
    return this.signJwt(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.delete({ refreshToken });
  }
}
