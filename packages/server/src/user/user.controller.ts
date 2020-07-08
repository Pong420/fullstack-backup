import { Controller, Post, Body, Get, Query, Patch, Req } from '@nestjs/common';
import { UserRole } from '@fullstack/typings';
import { paths } from '@fullstack/common/constants';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Access } from '../utils/access.guard';
import {
  MongooseCRUDController,
  PaginateResult,
  ObjectId,
  Condition
} from '../utils/mongoose-crud.controller';
import { UserRolePipe } from './user-role.pipe';

const roles = Object.values(UserRole)
  .filter((v): v is number => !isNaN(Number(v)))
  .map(role => ({ role }));

@Controller(paths.user.prefix)
@Access('ADMIN', 'MANAGER', 'SELF')
export class UserController extends MongooseCRUDController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Get(paths.user.get_users)
  @Access('ADMIN', 'MANAGER', 'GUEST')
  getAll(
    @Query() query: QueryUserDto,
    @Req() req: FastifyRequest
  ): Promise<PaginateResult<User>> {
    const { user } = req;

    const condition: Condition[] = user
      ? [
          {
            $or:
              user.role === UserRole.GUEST
                ? [{ role: UserRole.CLIENT }]
                : roles.filter(({ role }) => role > user.role)
          },
          { $nor: [{ username: req.user.username }] } // Exclude self
        ]
      : undefined;

    return this.userService.paginate({
      ...query,
      condition
    });
  }

  @Post(paths.user.create_user)
  @Access('ADMIN', 'MANAGER')
  create(@Body(UserRolePipe) dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Patch(paths.user.update_user)
  @Access('ADMIN', 'MANAGER', 'SELF')
  async update(
    @ObjectId() id: string,
    @Body(UserRolePipe) changes: UpdateUserDto
  ): Promise<User> {
    return this.userService.update({ _id: id }, changes);
  }
}
