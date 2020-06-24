import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@fullstack/typings';
import { FastifyCookieOptions } from 'fastify-cookie';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { JWTSignPayload, JWTSignResult } from 'src/typings';
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

      if (valid) {
        return {
          user_id: user.id,
          username: user.username,
          role: user.role
        };
      }

      throw new BadRequestException('Incorrect Password');
    } else {
      const admin = await this.userService.findAll({ role: UserRole.ADMIN });

      if (!admin.length) {
        const [defaultUsername, defaultPassword] = [
          'DEFAULT_USERNAME',
          'DEFAULT_PASSWORD'
        ].map(k => this.configService.get(k));

        if (username === defaultUsername && pass === defaultPassword) {
          return {
            user_id: defaultUsername,
            username: defaultUsername,
            role: UserRole.ADMIN
          };
        }
      }
    }

    throw new BadRequestException('User Not Found');
  }

  signJwt({ user_id, username, role }: JWTSignPayload): JWTSignResult {
    const now = +new Date();
    const payload: JWTSignPayload = { user_id, role, username };
    return {
      token: this.jwtService.sign({
        ...payload,
        iat: now
      }),
      expiry: new Date(
        now +
          Number(
            this.configService.get<string>('JWT_TOKEN_EXPIRES_IN_MINUTES')
          ) *
            60 *
            1000
      )
    };
  }

  getTokenCookieOps(): FastifyCookieOptions {
    return {
      maxAge:
        Number(
          this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN_MINUTES')
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
    this.refreshTokenService.delete({ refreshToken });
  }
}
