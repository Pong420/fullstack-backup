import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { MongooseCRUDController } from '../utils/MongooseCRUDController';
import { CreateUserDto } from './dto/create-user.dto';
import { Access } from '../utils/role.guard';

@Controller('user')
export class UserController extends MongooseCRUDController<User, UserService> {
  constructor(private readonly userService: UserService) {
    super(userService, {
      searchKeys: ['username', 'email', 'nickname']
    });
  }

  @Post()
  @Access('ADMIN', 'MANAGER')
  async create(dto: CreateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = (await this.userService.create(dto)).toJSON();
    return user;
  }
}
