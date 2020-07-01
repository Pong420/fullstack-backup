import { ValidateIf, IsString, IsNotEmpty } from 'class-validator';
import { Param$ModifyPassword } from '@fullstack/typings';
import { ValidPassword } from 'src/decorators';
import { BadRequestException } from '@nestjs/common';

export class ModifyUserPasswordDto implements Param$ModifyPassword {
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ValidateIf((o: ModifyUserPasswordDto) => {
    if (o.password === o.newPassword) {
      throw new BadRequestException(
        'The new password you entered is the same as your old password'
      );
    }
    return true;
  })
  @ValidPassword()
  newPassword!: string;

  @ValidateIf((o: ModifyUserPasswordDto) => {
    if (o.newPassword !== o.confirmNewPassword) {
      throw new BadRequestException(
        'Confirm password is not equal to the new password'
      );
    }
    return true;
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword!: string;
}
