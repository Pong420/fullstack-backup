import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { User } from './schemas/user.schema';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  constructor(@InjectModel(User.name) model: PaginateModel<User & Document>) {
    super(model);
  }
}
