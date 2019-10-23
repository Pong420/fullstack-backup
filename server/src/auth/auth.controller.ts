import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  BadRequestException
} from '@nestjs/common';
import {
  UserService,
  CreateUserDto,
  RemoveUserDto,
  UpdateUserDto,
  ModifyUserPasswordDto
} from '../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  getUsers() {
    return this.userService.findAll();
  }

  @Post('/registor')
  registor(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete('/remove')
  remove(@Body() removeUserDto: RemoveUserDto) {
    return this.userService.remove(removeUserDto);
  }

  @Patch('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Patch('/modify-password')
  modifyPassword(@Body() modifyPasswordUserDto: ModifyUserPasswordDto) {
    return this.userService.modifyPassword(modifyPasswordUserDto);
  }
}
