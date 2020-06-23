import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { MongooseCRUDController } from '../utils/MongooseCRUDController';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController extends MongooseCRUDController<User, UserService> {
  constructor(private readonly userService: UserService) {
    super(userService, {
      searchKeys: ['username', 'email', 'nickname']
    });
  }

  @Post()
  create(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
