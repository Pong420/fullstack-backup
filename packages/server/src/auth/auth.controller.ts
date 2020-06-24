import {
  Controller,
  UseGuards,
  Post,
  Req,
  Res,
  HttpStatus,
  Body,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from 'src/user/user.service';
import { transformResponse } from 'src/utils/ResponseInterceptor';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { JWTSignPayload } from 'src/typings';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schemas/user.schema';
import { AuthService } from './auth.service';

const REFRESH_TOKEN_COOKIES = 'fullstack_refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const isDefaultAc = !(req.user instanceof Document);
    const user: JWTSignPayload = isDefaultAc ? req.user : req.user.toJSON();
    const sign = this.authService.signJwt(user);
    const refreshToken = uuidv4();

    try {
      await this.refreshTokenService.update(
        { user_id: user.user_id },
        {
          ...user,
          refreshToken,
          expires: new Date(new Date().getTime() + 1 + 60 * 1000)
        },
        { upsert: true }
      );
    } catch (error) {
      console.error(error);
    }

    return reply
      .setCookie(
        REFRESH_TOKEN_COOKIES,
        refreshToken,
        this.authService.getTokenCookieOps()
      )
      .status(HttpStatus.OK)
      .send(transformResponse(HttpStatus.OK, { ...sign, user, isDefaultAc }));
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    if (tokenFromCookies) {
      const newRefreshToken = uuidv4();
      const exists = await this.refreshTokenService.update(
        { refreshToken: tokenFromCookies },
        { refreshToken: newRefreshToken }
      );

      if (exists) {
        const payload = this.authService.signJwt(exists.toJSON());
        return reply
          .setCookie(
            REFRESH_TOKEN_COOKIES,
            newRefreshToken,
            this.authService.getTokenCookieOps()
          )
          .status(HttpStatus.OK)
          .send(transformResponse(HttpStatus.OK, payload));
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(new BadRequestException('Invalid refresh token'));
    }

    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send(new BadRequestException('Refresh token not found'));
  }

  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ): Promise<FastifyReply> {
    await this.authService.logout(req.cookies[REFRESH_TOKEN_COOKIES]);
    return res
      .setCookie(REFRESH_TOKEN_COOKIES, '', {
        httpOnly: true,
        expires: new Date(0)
      })
      .status(HttpStatus.OK)
      .send(transformResponse(HttpStatus.OK, 'OK'));
  }
}
