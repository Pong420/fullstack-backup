import { IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  Param$UpdateUser,
  UserRole,
  Schema$User,
  DTOExcluded
} from '@fullstack/typings';

class Excluded implements DTOExcluded<Schema$User, Param$UpdateUser> {
  @Exclude()
  id?: string;

  @Exclude()
  username?: string;

  @Exclude()
  password?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

class UpdateUser extends Excluded
  implements Partial<Omit<Schema$User & Param$UpdateUser, keyof Excluded>> {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string | null;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(payload => (Array.isArray(payload) ? payload : [payload]))
  address?: string[] | null;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Param$UpdateUser, keyof UpdateUser>> {}
