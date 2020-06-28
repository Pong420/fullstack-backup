import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import { Schema$User, Param$GetUsers, UserRole } from '@fullstack/typings';
import { QueryDto } from '../../utils/MongooseCRUDService';

class Base extends QueryDto implements Param$GetUsers {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

class QueryUser extends Base
  implements Partial<Omit<Param$GetUsers | Schema$User, keyof Base>> {
  @IsEmpty()
  password?: string;

  @IsEmpty()
  avatar?: any;
}

export class QueryUserDto extends QueryUser
  implements Required<Omit<Param$GetUsers & Schema$User, keyof QueryUser>> {}
