import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { User, UserRole } from '../model/user.model';
import { UploadFile } from '../../upload';

export class CreateUserDto implements Partial<Omit<User, 'avatar'>> {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  nickname?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  avatar?: UploadFile;
}
