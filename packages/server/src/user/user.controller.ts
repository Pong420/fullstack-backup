import { Controller, Post, Body, Get, Query, Patch, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Access } from '../utils/role.guard';
import {
  MongooseCRUDController,
  PaginateResult,
  ObjectId,
  Condition
} from '../utils/MongooseCRUDController';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@fullstack/typings';

const roles = Object.values(UserRole)
  .filter((v): v is number => !isNaN(Number(v)))
  .map(role => ({ role }));

@Controller('user')
@Access('ADMIN', 'MANAGER', 'SELF')
export class UserController extends MongooseCRUDController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  @Access('ADMIN', 'MANAGER')
  create(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
  @Get()
  @Access('ADMIN', 'MANAGER')
  getAll(
    @Query() query: QueryUserDto,
    @Req() req: FastifyRequest
  ): Promise<PaginateResult<User>> {
    const { user } = req;
    const condition: Condition[] = user
      ? [
          {
            $or: roles.filter(({ role }) => role > user.role)
          },
          { $nor: [{ username: req.user.username }] } // Exclude self
        ]
      : undefined;
    return this.userService.paginate({
      ...query,
      condition
    });
  }

  @Patch(':id')
  @Access('ADMIN', 'MANAGER', 'SELF')
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateUserDto
  ): Promise<User> {
    return this.userService.update({ _id: id }, changes);
  }
}
