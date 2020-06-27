import { Controller, Post, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Access } from '../utils/role.guard';
import {
  MongooseCRUDController,
  PaginateResult,
  QueryAll
} from '../utils/MongooseCRUDController';

@Controller('user')
@Access('ADMIN', 'MANAGER', 'SELF')
export class UserController extends MongooseCRUDController<User> {
  constructor(private readonly userService: UserService) {
    super(userService, {
      searchKeys: ['username', 'email', 'nickname']
    });
  }

  @Post()
  @Access('ADMIN', 'MANAGER')
  create(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get()
  @Access('ADMIN', 'MANAGER')
  getAll(@Query() query?: QueryAll<User>): Promise<PaginateResult<User>> {
    return this.userService.paginate(query);
  }
}
