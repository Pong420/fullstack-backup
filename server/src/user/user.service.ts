import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { UserModel } from './model/user.model';
import { CreateUserDto, RemoveUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const createdUser = new UserModel(createUserDto);

    try {
      return await createdUser.save();
    } catch (error) {
      if (error instanceof MongoError) {
        switch (error.code) {
          case 11000:
            throw new BadRequestException('Username have been used');
        }
      }
    }
  }

  remove({ username }: RemoveUserDto) {
    return UserModel.deleteOne({ username });
  }

  update({ username, ...changes }: UpdateUserDto) {
    return UserModel.findOneAndUpdate({ username }, changes, {
      new: true
    });
  }

  findOne(username: string) {
    return UserModel.findOne({ username });
  }

  // TODO: remove it from production
  findAll() {
    return UserModel.find();
  }
}
