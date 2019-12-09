import { IsOptional, IsEnum, IsNotEmpty, IsEmpty } from 'class-validator';
import { User, UserRole } from '../model/user.model';
import { UploadFile } from '../../upload';

export class UpdateUserDto implements Partial<Omit<User, 'avatar'>> {
  @IsEmpty()
  id!: string;

  @IsOptional()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: UploadFile | null;

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
