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
  Query, // eslint-disable-line
  UseInterceptors
} from '@nestjs/common';
import { SERVICE_PATHS } from '@fullstack/service';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RoleGuard, UserLevels, hasPermission } from '../guards';
import { UserRole, User } from './model/user.model';
import { PaginationDto, SearchDto } from '../dto';
import { MultiPartInterceptor } from '../interceptors';
import { formatSearchQuery } from '../utils';

@UseGuards(RoleGuard(UserRole.GUEST))
@Controller(SERVICE_PATHS.USER.PREFIX)
export class UserController {
  constructor(private readonly userService: UserService) {}

  hasPermission(...args: Parameters<typeof hasPermission>) {
    if (hasPermission(...args)) {
      return true;
    }

    throw new BadRequestException('Permission denied');
  }

  @Get(SERVICE_PATHS.USER.GET_USERS)
  async getUsers(
    @Req() req: FastifyRequest,
    @Query()
    { pageNo, pageSize, search }: PaginationDto & SearchDto = {}
  ) {
    const roles = UserLevels.slice(0, UserLevels.indexOf(req.user.role) + 1);
    const searchKeys: Array<keyof User> = [
      'username',
      'email',
      'nickname',
      'role'
    ];
    return this.userService.paginate(
      {
        $and: [
          formatSearchQuery(searchKeys, search),
          { $or: roles.length ? roles.map(role => ({ role })) : undefined },
          { $nor: [{ username: req.user.username }] } // Exclude self
        ]
      },
      {
        sort: { createdAt: 1 },
        page: pageNo,
        limit: pageSize
      }
    );
  }

  @Get('/') // FIXME:
  @Get(SERVICE_PATHS.USER.GET_USER)
  async getUser(@Req() req: FastifyRequest, @Param('id') id?: string) {
    const targerUser = await this.userService.findOne({
      id,
      username: req.user.username
    });

    if (targerUser) {
      if (this.hasPermission(req.user, targerUser, ['higher', 'self'])) {
        return targerUser;
      }
    }

    throw new BadRequestException('User not found');
  }

  @Post(SERVICE_PATHS.USER.CREATE_USER)
  @UseInterceptors(MultiPartInterceptor())
  createUser(@Body() createUserDto: CreateUserDto, @Req() req: FastifyRequest) {
    if (this.hasPermission(req.user, createUserDto)) {
      return this.userService.create(createUserDto);
    }
  }

  @Delete(SERVICE_PATHS.USER.DELETE_USER)
  async deleteUser(@Param('id') id: string, @Req() req: FastifyRequest) {
    const targerUser = await this.userService.findOne({ id });

    if (targerUser) {
      if (this.hasPermission(req.user, targerUser, ['higher'])) {
        return this.userService.delete(id);
      }

      throw new BadRequestException('User not found');
    }
  }

  @Patch(SERVICE_PATHS.USER.UPDATE_USER)
  @UseInterceptors(MultiPartInterceptor())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: FastifyRequest
  ) {
    const targerUser = await this.userService.findOne({ id });
    if (targerUser) {
      if (this.hasPermission(req.user, targerUser, ['higher', 'self'])) {
        return this.userService.update(id, { ...updateUserDto });
      }
    }

    throw new BadRequestException('User not found');
  }
}
