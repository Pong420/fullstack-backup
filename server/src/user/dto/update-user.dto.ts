import { IsString, IsOptional } from 'class-validator';
import { User } from '../model/user.model';

export class UpdateUserDto implements Partial<Omit<User, 'id' | 'password'>> {
  @IsString()
  username!: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  role?: string;
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
