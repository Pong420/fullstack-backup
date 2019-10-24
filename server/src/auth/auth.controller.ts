import { Controller, Post, Body } from '@nestjs/common';
import { UserService, CreateUserDto } from '../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/registor')
  registor(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
