import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel, FilterQuery } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  constructor(@InjectModel(User.name) model: PaginateModel<User & Document>) {
    super(model, {
      searchKeys: ['username', 'email', 'nickname']
    });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return super.create(createUserDto);
  }

  update(
    query: FilterQuery<User>,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    return super.update(query, updateUserDto);
  }
}
