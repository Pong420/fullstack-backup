import { IsString } from 'class-validator';
import { User } from '../model/user.model';

export class RemoveUserDto implements Pick<User, 'username'> {
  @IsString()
  username!: string;
}
