import { IsOptional, IsEnum, IsNotEmpty, IsEmpty } from 'class-validator';
import { User, UserRole } from '../model/user.model';

export class UpdateUserDto implements Partial<User> {
  @IsEmpty()
  id!: string;

  @IsOptional()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  nickname?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class ModifyUserPasswordDto implements Partial<User> {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  newPassword!: string;

  @IsNotEmpty()
  confirmNewPassword!: string;
}
