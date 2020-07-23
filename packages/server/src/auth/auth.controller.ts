import {
  Controller,
  UseGuards,
  Post,
  Req,
  Res,
  HttpStatus,
  Body,
  BadRequestException,
  UnauthorizedException,
  Delete,
  Patch
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  UserRole,
  JWTSignPayload,
  Schema$Authenticated,
  Schema$CloudinarySign
} from '@fullstack/typings';
import { paths } from '@fullstack/common/constants';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/schemas/user.schema';
import { RefreshToken } from '../refresh-token/schemas/refreshToken.schema';
import { transformResponse } from '../utils/response.interceptor';
import { throwMongoError } from '../utils/mongoose-exception-filter';
import { Access } from '../utils/access.guard';
import { IsObjectId } from '../decorators';
import { formatJWTSignPayload } from './dto/jwt-sign.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ModifyUserPasswordDto } from './dto/modify-password.dto';

export const REFRESH_TOKEN_COOKIES = 'fullstack_refresh_token';

@Access('EVERYONE')
@Controller(paths.auth.prefix)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post(paths.auth.guest_registration)
  @Access('EVERYONE')
  registerGuest(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({ ...createUserDto, role: UserRole.GUEST });
  }

  @Post(paths.auth.admin_registration)
  @Access('ADMIN')
  registerAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    // TODO: check admin?
    return this.userService.create({ ...createUserDto, role: UserRole.ADMIN });
  }

  @Post(paths.auth.registration)
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({ ...createUserDto, role: UserRole.CLIENT });
  }

  @Post(paths.auth.login)
  @UseGuards(AuthGuard('local'))
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const user: JWTSignPayload = req.user;
    const signPayload = this.authService.signJwt(user);
    const refreshToken = uuidv4();

    try {
      await this.refreshTokenService.update(
        { user_id: user.user_id },
        { ...user, refreshToken },
        { upsert: true }
      );
    } catch (error) {
      throwMongoError(error);
    }

    return reply
      .setCookie(
        REFRESH_TOKEN_COOKIES,
        refreshToken,
        this.authService.getTokenCookieOps()
      )
      .status(HttpStatus.OK)
      .send(
        transformResponse<Schema$Authenticated>(HttpStatus.OK, {
          ...signPayload,
          user,
          isDefaultAc: !IsObjectId(user.user_id)
        })
      );
  }

  @Post(paths.auth.refresh_token)
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    if (tokenFromCookies) {
      const newRefreshToken = uuidv4();
      let refreshToken: RefreshToken | null = null;

      try {
        refreshToken = await this.refreshTokenService.update(
          { refreshToken: tokenFromCookies },
          { refreshToken: newRefreshToken }
        );
      } catch (error) {
        throwMongoError(error);
      }

      if (refreshToken) {
        const refreshTokenJson = refreshToken.toJSON();
        const signResult = this.authService.signJwt(refreshTokenJson);
        return reply
          .setCookie(
            REFRESH_TOKEN_COOKIES,
            newRefreshToken,
            this.authService.getTokenCookieOps()
          )
          .status(HttpStatus.OK)
          .send(
            transformResponse<Schema$Authenticated>(HttpStatus.OK, {
              ...signResult,
              isDefaultAc: false,
              user: formatJWTSignPayload(refreshTokenJson)
            })
          );
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(new BadRequestException('Invalid refresh token'));
    }

    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send(new UnauthorizedException());
  }

  @Post(paths.auth.logout)
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

  @Delete(paths.auth.delete_account)
  @Access('PASSWORD')
  async deleteAccount(
    @Req() req: FastifyRequest,
    @Body() _deleteAccountDto: DeleteAccountDto
  ): Promise<void> {
    return this.userService.delete({ _id: req.user.user_id });
  }

  @Patch(paths.auth.modify_password)
  @Access('PASSWORD')
  async modifyPassword(
    @Req() req: FastifyRequest,
    @Body() { newPassword }: ModifyUserPasswordDto
  ): Promise<void> {
    await this.userService.update(
      { _id: req.user.user_id },
      { password: newPassword }
    );
  }

  @Post(paths.auth.cloudinary_sign)
  @Access('ADMIN', 'MANAGER', 'CLIENT', 'GUEST')
  cloudinarySign(): Schema$CloudinarySign {
    return this.cloudinaryService.sign();
  }
}
