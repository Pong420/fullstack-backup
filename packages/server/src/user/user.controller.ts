import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Access } from '../utils/role.guard';
import {
  MongooseCRUDController,
  PaginateResult,
  ObjectId
} from '../utils/MongooseCRUDController';
import { UpdateUserDto } from './dto/update-user.dto';

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
  getAll(@Query() query?: QueryUserDto): Promise<PaginateResult<User>> {
    return this.userService.paginate(query);
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
