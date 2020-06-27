import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import { Required$CreateUser, Schema$User, UserRole } from '@fullstack/typings';
import { ValidUsername, ValidPassword } from '../../decorators';

class Base implements Required$CreateUser {
  @ValidUsername()
  username!: string;

  @ValidPassword()
  password!: string;

  @IsEmail()
  email!: string;
}

class CreateUser extends Base
  implements Partial<Omit<Schema$User | Required$CreateUser, keyof Base>> {
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
  implements
    Required<Omit<Schema$User & Required$CreateUser, keyof CreateUser>> {}
