import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import { Schema$User, UserRole } from '@fullstack/typings';
import { QueryDto } from '../../utils/MongooseCRUDService';
import { User } from '../schemas/user.schema';

class Base extends QueryDto implements Partial<User> {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsEmpty()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsEmpty()
  avatar?: any;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

class QueryUser extends Base
  implements Partial<Omit<Schema$User, keyof Base>> {}

export class QueryUserDto extends QueryUser
  implements Required<Omit<Schema$User, keyof QueryUser>> {}
