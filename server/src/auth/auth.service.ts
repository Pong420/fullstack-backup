import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyCookieOptions } from 'fastify-cookie';
import { ConfigService } from '../config';
import { UserService, UserRole } from '../user';
import { JWTSignPayload } from './interfaces/jwt.interfaces';
import { RefreshTokenModel } from './model/refreshToken.modal';
import { CreateRefreshTokenDto, UpdateRefreshTokenDto } from './dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {
    const index = 'updatedAt';
    RefreshTokenModel.collection
      .dropIndex(`${index}_1`)
      .catch(err => err)
      .then(() => {
        RefreshTokenModel.collection.createIndex(
          { [index]: 1 },
          {
            expireAfterSeconds:
              Number(this.configService.get('REFRESH_TOKEN_EXPIRES')) * 60
          }
        );
      });
  }

  async validateUser(username: string, pass: string): Promise<JWTSignPayload> {
    const user = await this.usersService.findOne({ username }, '');

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);

      if (valid) {
        return user;
      }

      throw new BadRequestException('Invalid Password');
    } else {
      const admin = await this.usersService.findAll({ role: UserRole.ADMIN });
      if (!admin.length) {
        const [defaultUsername, defaultPassword] = this.configService.get([
          'DEFAULT_USERNAME',
          'DEFAULT_PASSWORD'
        ]);

        if (username === defaultUsername && pass === defaultPassword) {
          return { username: defaultUsername, role: UserRole.ADMIN };
        }
      }
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

  getTokenCookieOpts(): FastifyCookieOptions {
    return {
      maxAge:
        Number(this.configService.get('REFRESH_TOKEN_EXPIRES')) * 60 * 1000,
      httpOnly: true,
      secure: false
    };
  }

  createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto) {
    const createdToken = new RefreshTokenModel(createRefreshTokenDto);
    return createdToken.save();
  }

  findAndUpdateRefreshToken(
    { refreshToken }: UpdateRefreshTokenDto,
    newRefreshToken: string
  ) {
    return RefreshTokenModel.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: newRefreshToken
      }
    );
  }

  async findAllToken() {
    return RefreshTokenModel.find();
  }

  async login(user: JWTSignPayload) {
    return this.signJwt(user);
  }

  logout(refreshToken: string) {
    return RefreshTokenModel.deleteOne({ refreshToken });
  }
}
