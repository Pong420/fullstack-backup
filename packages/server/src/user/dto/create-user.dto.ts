import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  Param$CreateUser,
  Schema$User,
  UserRole,
  Uploaded
} from '@fullstack/typings';
import { ValidUsername, ValidPassword } from '../../decorators';

class Base implements Param$CreateUser {
  @ValidUsername()
  username: string;

  @ValidPassword()
  password: string;

  @IsEmail()
  email: string;
}

class CreateUser extends Base
  implements Partial<Omit<Schema$User | Param$CreateUser, keyof Base>> {
  @Exclude()
  id?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  avatar?: Uploaded | string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

export class CreateUserDto extends CreateUser
  implements Required<Omit<Schema$User & Param$CreateUser, keyof CreateUser>> {}
