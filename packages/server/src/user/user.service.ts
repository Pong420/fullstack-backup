import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { PaginateOptions, QueryFindOneAndUpdateOptions } from 'mongoose';
import { UserModel, User } from './model/user.model';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UploadService, UploadFile, isUploadFile } from '../upload';

@Injectable()
export class UserService {
  constructor(private readonly uploadService: UploadService) {}

  async handleAvatar(newAvatar?: UploadFile | null, oldAvatar?: string | null) {
    if (newAvatar !== undefined && oldAvatar !== undefined) {
      // ignore the remove old avatar process
      oldAvatar && this.uploadService.removeImage(oldAvatar);

      const result = isUploadFile(newAvatar)
        ? (await this.uploadService.uploadImage(newAvatar, {}))[0]
        : undefined;

      return result
        ? {
            avatar: this.uploadService.getImageUrl(
              `${result.public_id}.${result.format}`,
              {
                secure: true,
                transformation: [{ width: 200, height: 200, crop: 'limit' }]
              }
            )
          }
        : { avatar: null };
    }

    return {};
  }

  async create({ avatar, ...createUserDto }: CreateUserDto) {
    avatar && (await this.uploadService.uploadImage(avatar));
    const createdUser = new UserModel({
      nickname: createUserDto.username,
      ...(await this.handleAvatar(avatar)),
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
            throw new BadRequestException('Email have been register');
        }
      }
    }
  }

  async delete(id: string) {
    const user = await UserModel.findOneAndDelete({ _id: id });
    if (user && user.avatar) {
      this.uploadService.removeImage(user.avatar);
    }
  }

  async update(
    id: string,
    { avatar, oldAvatar, ...changes }: UpdateUserDto,
    options?: QueryFindOneAndUpdateOptions
  ) {
    return UserModel.findOneAndUpdate(
      { _id: id },
      { ...changes, ...(await this.handleAvatar(avatar, oldAvatar)) },
      {
        new: true,
        ...options
      }
    );
  }

  findOne({ id, ...user }: Partial<User>, projection = '') {
    return UserModel.findOne(
      JSON.parse(JSON.stringify({ _id: id, ...user })),
      projection
    );
  }

  find(condition?: object, projection = '') {
    return UserModel.find(condition, projection);
  }

  paginate(
    condition?: object,
    { page = 1, limit = 10, ...options }: PaginateOptions = {}
  ) {
    return UserModel.paginate(condition, {
      page,
      limit,
      ...options
    });
  }
}
