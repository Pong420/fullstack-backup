import { Controller, Body, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginateResult } from '@fullstack/typings';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<PaginateResult<User>> {
    return this.userService.paginate();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
