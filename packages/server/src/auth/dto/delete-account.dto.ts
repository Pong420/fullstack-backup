import { IsNotEmpty } from 'class-validator';
import { User } from '../../user';

export class DeleteAccountDto implements Partial<User> {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  password!: string;
}
