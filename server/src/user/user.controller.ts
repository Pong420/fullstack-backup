import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  BadRequestException,
  UseGuards,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ModifyUserPasswordDto } from './dto';
import { RoleGuard } from '../guards';

@UseGuards(RoleGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Post('/')
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    return this.userService.update({ ...updateUserDto, id });
  }

  @Patch('/modify-password')
  modifyPassword(@Body() modifyPasswordUserDto: ModifyUserPasswordDto) {
    const {
      id,
      password,
      newPassword,
      confirmNewPassword
    } = modifyPasswordUserDto;

    if (password === newPassword) {
      throw new BadRequestException(
        'The new password you entered is the same as your old password'
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'The new passwords you entered is not same'
      );
    }

    return this.userService.update({ id, password: newPassword });
  }
}
