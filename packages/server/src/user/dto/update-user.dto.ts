import {
  IsOptional,
  IsString,
  IsEnum,
  IsEmpty,
  IsEmail
} from 'class-validator';
import { Param$UpdateUser, UserRole } from '@fullstack/typings';
import { ValidPassword } from '../../decorators';

export class UpdateUser implements Partial<Param$UpdateUser> {
  @IsEmpty()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
  @ValidPassword()
  password?: string;

  @IsOptional()
  // avatar?: UploadFile | null;
  avatar?: null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Param$UpdateUser, keyof UpdateUser>> {}
