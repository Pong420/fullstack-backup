import {
  Controller,
  UseGuards,
  Post,
  Req,
  Res,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from 'src/user/user.service';
import { transformResponse } from 'src/utils/ResponseInterceptor';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { AuthService } from './auth.service';
import { JWTSignPayload } from 'src/typings';

const REFRESH_TOKEN = 'fullstack_refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
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
        REFRESH_TOKEN,
        refreshToken,
        this.authService.getTokenCookieOps()
      )
      .status(HttpStatus.OK)
      .send(transformResponse(HttpStatus.OK, { ...sign, user, isDefaultAc }));
  }
}
