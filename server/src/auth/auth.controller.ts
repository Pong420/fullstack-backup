import { Controller, Req, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { UserService, CreateUserDto, UserModel } from '../user';
import { AuthService } from './auth.service';

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
  async login(@Req() req: FastifyRequest) {
    const user = req.user as typeof UserModel;
    return this.authService.login(user);
  }
}
