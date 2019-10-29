import { IsString, IsOptional, IsEnum } from 'class-validator';
import { User } from '../model/user.model';
import { Role } from '../../typings';

export class UpdateUserDto implements Partial<Omit<User, 'id' | 'password'>> {
  @IsString()
  username!: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class ModifyUserPasswordDto
  implements Pick<User, 'username' | 'password'> {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  newPassword!: string;

  @IsString()
  confirmNewPassword!: string;
}
