import {
  IsOptional,
  IsString,
  IsEnum,
  IsEmpty,
  IsEmail
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Param$UpdateUser, UserRole, Uploaded } from '@fullstack/typings';

export class UpdateUser implements Partial<Param$UpdateUser> {
  @IsEmpty()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsEmpty()
  password?: string;

  @IsOptional()
  avatar?: Uploaded;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Param$UpdateUser, keyof UpdateUser>> {}
