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
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { transformResponse } from '../utils/ResponseInterceptor';

const REFRESH_TOKEN = 'fullstack_refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const isDefaultAc = !(req.user instanceof Document);
    const user = isDefaultAc ? req.user : req.user.toJSON();
    const sign = this.authService.signJwt(user);
    const refreshToken = uuidv4();

    delete user.password;

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
