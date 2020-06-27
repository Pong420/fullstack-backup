import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import { Param$CreateUser, Schema$User, UserRole } from '@fullstack/typings';
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
  @IsEmpty()
  id?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  avatar?: unknown;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class CreateUserDto extends CreateUser
  implements Required<Omit<Schema$User & Param$CreateUser, keyof CreateUser>> {}
