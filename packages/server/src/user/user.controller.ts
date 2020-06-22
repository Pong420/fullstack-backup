import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { MongooseCRUDConroller } from '../utils/MongooseCRUDConroller';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController extends MongooseCRUDConroller<User, UserService> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  create(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
