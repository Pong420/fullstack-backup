import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  BadRequestException,
  UseGuards,
  Param,
  Req
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ModifyUserPasswordDto } from './dto';
import { RoleGuard, UserLevels } from '../guards';
import { UserRole, User } from './model/user.model';

@UseGuards(RoleGuard(UserRole.MANAGER))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  hasPermission(
    req: FastifyRequest,
    user: Pick<User, 'username' | 'role'>,
    equal = false
  ) {
    if (
      (equal && req.user.username === user.username) ||
      UserLevels.indexOf(req.user.role) >= UserLevels.indexOf(user.role)
    ) {
      return true;
    }
    throw new BadRequestException('Permission denied');
  }

  @Get('/')
  getUsers(@Req() req: FastifyRequest) {
    const roles = UserLevels.slice(0, UserLevels.indexOf(req.user.role) + 1);
    return this.userService.findAll({
      $or: roles.length ? roles.map(role => ({ role })) : undefined
    });
  }

  @Get('/:id')
  async getUser(@Param('id') id: string, @Req() req: FastifyRequest) {
    const user = await this.userService.findOne({ id });
    if (user) {
      if (this.hasPermission(req, user, true)) {
        return user;
      }

      throw new BadRequestException('User not found');
    }
  }

  @Post('/')
  addUser(@Body() createUserDto: CreateUserDto, @Req() req: FastifyRequest) {
    if (this.hasPermission(req, createUserDto)) {
      return this.userService.create(createUserDto);
    }
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string, @Req() req: FastifyRequest) {
    const targerUser = await this.userService.findOne({ id });
    if (targerUser) {
      if (this.hasPermission(req, targerUser, true)) {
        return this.userService.remove(id);
      }

      throw new BadRequestException('User not found');
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: FastifyRequest
  ) {
    delete updateUserDto.id;

    const targerUser = await this.userService.findOne({ id });
    if (targerUser) {
      if (this.hasPermission(req, targerUser, true)) {
        return this.userService.update({ ...updateUserDto, id });
      }
    }

    throw new BadRequestException('User not found');
  }

  @Patch('/modify-password')
  modifyPassword(
    @Body() modifyPasswordUserDto: ModifyUserPasswordDto,
    @Req() req: FastifyRequest
  ) {
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

    return this.update(id, { id, password: newPassword }, req);
  }
}
