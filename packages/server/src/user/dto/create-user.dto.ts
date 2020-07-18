import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  Param$CreateUser,
  Schema$User,
  UserRole,
  DTOExcluded
} from '@fullstack/typings';
import { ValidUsername, ValidPassword } from '../../decorators';

class Excluded implements DTOExcluded<Schema$User, Param$CreateUser> {
  @Exclude()
  id?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

class CreateUser extends Excluded
  implements Partial<Omit<Schema$User | Param$CreateUser, keyof Excluded>> {
  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(payload => (Array.isArray(payload) ? payload : [payload]))
  address?: string[] | null;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class CreateUserDto extends CreateUser
  implements Required<Omit<Schema$User & Param$CreateUser, keyof CreateUser>> {
  @ValidUsername()
  username: string;

  @ValidPassword()
  password: string;

  @IsEmail()
  email: string;
}
