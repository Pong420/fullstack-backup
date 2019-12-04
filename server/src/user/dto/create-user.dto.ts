import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsLowercase
} from 'class-validator';
import { User, UserRole } from '../model/user.model';

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role!: UserRole;
}
