import {
  Controller,
  Req,
  Res,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SERVICE_PATHS } from '@fullstack/common/service';
import { isDocument } from '@typegoose/typegoose';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService, CreateUserDto, UserRole } from '../user';
import { transformResponse } from '../interceptors';
import { RoleGuard } from '../guards';
import { AuthService } from './auth.service';
import { ModifyUserPasswordDto, DeleteAccountDto } from './dto';

import uuidv4 from 'uuid/v4';

const REFRESH_TOKEN = 'refresh_token';

@Controller(SERVICE_PATHS.AUTH.PREFIX)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post(SERVICE_PATHS.AUTH.ADMIN_REGISTRATION)
  @UseGuards(RoleGuard(UserRole.ADMIN))
  adminRegistration(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, role: UserRole.ADMIN });
  }

  @Post(SERVICE_PATHS.AUTH.GUEST_REGISTRATION)
  async guestRegistration(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create({
        ...createUserDto,
        role: UserRole.GUEST
      });

      if (user) {
        return {
          user,
          ...(await this.authService.signJwt({
            id: user.id,
            username: user.username,
            role: user.role
          }))
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Post(SERVICE_PATHS.AUTH.REGISTRATION)
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, role: UserRole.CLIENT });
  }

  @UseGuards(AuthGuard('local'))
  @Post(SERVICE_PATHS.AUTH.LOGIN)
  async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const user = isDocument(req.user) ? req.user.toJSON() : req.user;
    const sign = await this.authService.signJwt(user);
    const refreshToken = uuidv4();

    await this.authService.createRefreshToken({ ...user, refreshToken });

    delete user.password;

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

  @Post(SERVICE_PATHS.AUTH.REFERTSH_TOKEN)
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

  @Post(SERVICE_PATHS.AUTH.LOOUT)
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
      return Promise.reject(error);
    }
  }

  @Patch(SERVICE_PATHS.AUTH.MODIFY_PASSWORD)
  @UseGuards(AuthGuard('jwt'))
  async modifyPassword(
    @Body() modifyPasswordUserDto: ModifyUserPasswordDto,
    @Req() req: FastifyRequest
  ) {
    const { id, password, newPassword } = modifyPasswordUserDto;
    const username = req.user.username;

    const valid = await this.authService.validateUser(username, password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return this.userService.update(id, { password: newPassword });
  }

  @Delete(SERVICE_PATHS.AUTH.DELETE_ACCOUNT)
  @UseGuards(AuthGuard('jwt'))
  async deleteAccount(
    @Body() deleteAccountDto: DeleteAccountDto,
    @Req() req: FastifyRequest
  ) {
    const { id, password } = deleteAccountDto;
    const username = req.user.username;

    const valid = await this.authService.validateUser(username, password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return this.userService.delete(id);
  }
}
