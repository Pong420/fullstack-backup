import { IsString, IsOptional, IsEnum } from 'class-validator';
import { User } from '../model/user.model';
import { Role } from '../../typings';

export class CreateUserDto
  implements Pick<User, 'username' | 'password' | 'role'> {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsEnum(Role)
  @IsOptional()
  role!: Role;
}
