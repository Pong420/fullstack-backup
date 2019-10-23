import { IsString } from 'class-validator';
import { User } from '../model/user.model';

export class CreateUserDto
  implements Pick<User, 'username' | 'password' | 'role'> {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: string;
}
