import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  RemoveUserDto,
  UpdateUserDto,
  ModifyUserPasswordDto
} from './dto';
import { RoleGuard } from '../utils/guards';

@UseGuards(RoleGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  getUsers() {
    return this.userService.findAll();
  }

  @Post('/add')
  add(@Body() removeUserDto: CreateUserDto) {
    return this.userService.create(removeUserDto);
  }

  @Delete('/remove')
  remove(@Body() removeUserDto: RemoveUserDto) {
    return this.userService.remove(removeUserDto);
  }

  @Patch('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    return this.userService.update(updateUserDto);
  }

  @Patch('/modify-password')
  modifyPassword(@Body() modifyPasswordUserDto: ModifyUserPasswordDto) {
    const {
      username,
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

    return this.userService.update({ username, password: newPassword });
  }
}
