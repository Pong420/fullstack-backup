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
  Req,
  Query // eslint-disable-line
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ModifyUserPasswordDto } from './dto';
import { RoleGuard, UserLevels } from '../guards';
import { UserRole, User } from './model/user.model';
import { PaginationDto } from '../dto/pagination.dto';

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

  @Get('/list')
  async getUsers(
    @Req() req: FastifyRequest,
    @Query() { pageNo, pageSize }: PaginationDto = {}
  ) {
    const roles = UserLevels.slice(0, UserLevels.indexOf(req.user.role) + 1);
    return this.userService.paginate(
      {
        $and: [
          { $or: roles.length ? roles.map(role => ({ role })) : undefined },
          { $nor: [{ username: req.user.username }] } // Exclude self
        ]
      },
      { sort: { createdAtquery: 1 }, page: pageNo, limit: pageSize }
    );
  }

  @Get('/')
  @Get('/:id')
  async getUser(@Req() req: FastifyRequest, @Param('id') id?: string) {
    const user = await this.userService.findOne({
      id,
      username: req.user.username
    });
    if (user) {
      if (this.hasPermission(req, user, true)) {
        return user;
      }
      throw new BadRequestException('User not found');
    }
  }

  @Post('/')
  createUser(@Body() createUserDto: CreateUserDto, @Req() req: FastifyRequest) {
    if (this.hasPermission(req, createUserDto)) {
      return this.userService.create(createUserDto);
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Req() req: FastifyRequest) {
    const targerUser = await this.userService.findOne({ id });
    if (targerUser) {
      if (this.hasPermission(req, targerUser, true)) {
        return this.userService.delete(id);
      }

      throw new BadRequestException('User not found');
    }
  }

  @Patch('/:id')
  async updateUser(
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

    return this.updateUser(id, { id, password: newPassword }, req);
  }
}
