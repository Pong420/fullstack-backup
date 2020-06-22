import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongooseCRUDService } from '../utils/MongooseCRUDService';

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  constructor(@InjectModel(User.name) model: PaginateModel<User>) {
    super(model);
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return super.create(createUserDto);
  }

  update({ id, ...createUserDto }: UpdateUserDto): Promise<User> {
    return super.update({ _id: id }, createUserDto);
  }
}
