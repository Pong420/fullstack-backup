import { IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import { Param$UpdateUser, UserRole } from '@fullstack/typings';

export class UpdateUser implements Partial<Param$UpdateUser> {
  @Exclude()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @Exclude()
  username?: string;

  @Exclude()
  password?: string;

  @IsOptional()
  avatar?: unknown;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;

  @IsString()
  @IsOptional()
  nickname?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Param$UpdateUser, keyof UpdateUser>> {}
