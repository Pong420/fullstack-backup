import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { UserModel, User } from './model/user.model';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const createdUser = new UserModel({
      nickname: createUserDto.username,
      ...createUserDto
    });

    try {
      await createdUser.save();
      // eslint-disable-next-line
      const { password, ...user } = createdUser.toJSON();
      return user;
    } catch (error) {
      if (error instanceof MongoError) {
        switch (error.code) {
          // FIXME: duplicate username
          case 11000:
            throw new BadRequestException('Email have been registor');
        }
      }
    }
  }

  remove(id: string) {
    return UserModel.deleteOne({ _id: id });
  }

  update({ id, ...changes }: UpdateUserDto) {
    return UserModel.findOneAndUpdate({ _id: id }, changes, {
      new: true,
      projection: '-password'
    });
  }

  findOne({ id, ...user }: Partial<User>) {
    return UserModel.findOne({ _id: id, ...user });
  }

  findAll() {
    return UserModel.find({}, '-password');
  }
}
