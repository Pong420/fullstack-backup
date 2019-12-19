import { IsNotEmpty, IsEmpty, ValidateIf } from 'class-validator';
import { User } from '../../user';

export class ModifyUserPasswordDto implements Partial<User> {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  password!: string;

  // TODO: foramt validation
  @ValidateIf(
    (o: ModifyUserPasswordDto) =>
      !o.newPassword || o.password === o.newPassword,
    {}
  )
  @IsNotEmpty()
  @IsEmpty({
    message: 'The new password you entered is the same as your old password'
  })
  newPassword!: string;
}
