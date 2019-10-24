import { Controller, Req, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { UserService, CreateUserDto } from '../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/registor')
  registor(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: FastifyRequest) {
    return req.user;
  }
}
