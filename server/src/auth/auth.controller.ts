import {
  Controller,
  Req,
  Res,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isDocument } from '@typegoose/typegoose';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService, CreateUserDto, UserRole } from '../user';
import { AuthService } from './auth.service';
import { transformResponse } from '../interceptors';
import { RoleGuard } from '../guards';

import uuidv4 from 'uuid/v4';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('/register/admin')
  @UseGuards(RoleGuard(UserRole.ADMIN))
  registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, role: UserRole.ADMIN });
  }

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, role: UserRole.CLIENT });
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const user = isDocument(req.user) ? req.user.toJSON() : req.user;
    const sign = await this.authService.signJwt(user);
    const refreshToken = uuidv4();

    await this.authService.createRefreshToken({ ...user, refreshToken });

    return reply
      .setCookie(
        REFRESH_TOKEN,
        refreshToken,
        this.authService.getTokenCookieOpts()
      )
      .status(HttpStatus.OK)
      .send(
        transformResponse(
          { user, isDefaultAc: !isDocument(req.user), ...sign },
          reply
        )
      );
  }

  @Post('/refresh_token')
  async refreshToken(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
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
            this.authService.getTokenCookieOpts()
          )
          .status(HttpStatus.OK)
          .send(transformResponse(payload, reply));
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(new BadRequestException('Invalid refresh token'));
    }

    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send(new BadRequestException('Refresh token not found'));
  }

  @Get('/refresh_token')
  async findAllToken() {
    return this.authService.findAllToken();
  }

  @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      await this.authService.logout(req.cookies[REFRESH_TOKEN]);

      res
        .setCookie(REFRESH_TOKEN, '', {
          httpOnly: true,
          expires: new Date(0)
        })
        .status(HttpStatus.OK)
        .send(transformResponse('OK', res));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
