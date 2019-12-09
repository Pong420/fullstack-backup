import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { User, UserRole } from '../model/user.model';
import { UploadFile } from '../../upload';

export class CreateUserDto implements Partial<Omit<User, 'avatar'>> {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  avatar?: UploadFile | null;
}
