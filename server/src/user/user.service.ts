import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { UserModel } from './model/user.model';
import { CreateUserDto, RemoveUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const createdUser = new UserModel(createUserDto);

    try {
      await createdUser.save();
      // eslint-disable-next-line
      const { password, ...user } = createdUser.toJSON();
      return user;
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
      new: true,
      projection: '-password'
    });
  }

  findOne(username: string) {
    return UserModel.findOne({ username });
  }

  findAll() {
    return UserModel.find({}, '-password');
  }
}
