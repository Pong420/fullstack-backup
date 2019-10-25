import {
  Controller,
  Req,
  Res,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService, CreateUserDto, UserModel } from '../user';
import { AuthService } from './auth.service';
import uuidv4 from 'uuid/v4';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('/registor')
  registor(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply<unknown>) {
    const user = req.user as typeof UserModel;
    const sign = await this.authService.signJwt(user);
    const refreshToken = uuidv4();

    await this.authService.findAndUpdateRefreshToken({}, refreshToken, true);

    return reply
      .setCookie(
        REFRESH_TOKEN,
        refreshToken,
        this.authService.getRefreshTokenCookieOps()
      )
      .status(HttpStatus.OK)
      .send(sign);
  }

  @Post('/refresh_token')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply<unknown>
  ) {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN];

    if (tokenFromCookies) {
      const newRefreshToken = uuidv4();
      const exists = await this.authService.findAndUpdateRefreshToken(
        { refreshToken: tokenFromCookies },
        newRefreshToken
      );

      if (exists) {
        const payload = await this.authService.signJwt(exists.toJSON());

        return reply
          .setCookie(
            REFRESH_TOKEN,
            newRefreshToken,
            this.authService.getRefreshTokenCookieOps()
          )
          .status(HttpStatus.OK)
          .send(payload);
      }

      return reply.status(HttpStatus.BAD_REQUEST).send('Invalid refresh token');
    }

    // TODO: map response
    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send('Refresh token not found');
  }

  @Get('/refresh_token')
  async findAllToken() {
    return this.authService.findAllToken();
  }
}
