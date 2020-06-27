import {
  IsOptional,
  IsString,
  IsEnum,
  IsEmpty,
  IsEmail
} from 'class-validator';
import { Required$UpdateUser, UserRole } from '@fullstack/typings';

export class UpdateUser implements Partial<Required$UpdateUser> {
  @IsEmpty()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
  // @MinLength(validationConfig.password.minLength)
  // @MaxLength(validationConfig.password.maxLength)
  // @Matches(validationConfig.password.regex)
  password?: string;

  @IsOptional()
  // avatar?: UploadFile | null;
  avatar?: null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Required$UpdateUser, keyof UpdateUser>> {}
