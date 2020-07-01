import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  Schema$User,
  Param$GetUsers,
  UserRole,
  Timestamp
} from '@fullstack/typings';
import { QueryDto } from '../../utils/mongoose-crud.service';

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
  @Exclude()
  password?: string;

  @Exclude()
  avatar?: unknown;
}

export class QueryUserDto extends QueryUser
  implements Required<Omit<Param$GetUsers & Schema$User, keyof QueryUser>> {}
