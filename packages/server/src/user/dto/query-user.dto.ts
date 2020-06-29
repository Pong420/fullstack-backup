import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import {
  Schema$User,
  Param$GetUsers,
  UserRole,
  Timestamp
} from '@fullstack/typings';
import { QueryDto } from '../../utils/MongooseCRUDService';
import { Transform } from 'class-transformer';

class Base extends QueryDto
  implements Partial<Omit<Param$GetUsers, keyof Timestamp>> {
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
  @Transform(Number)
  role?: UserRole;
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
