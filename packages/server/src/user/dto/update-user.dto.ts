import {
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsEmpty,
  ValidateIf,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';
import {
  Required$UpdateUser,
  UserRole
} from '@fullstack/common/service/typings';
import { validationConfig } from '@fullstack/common/utils/validationConfig';
import { UploadFile } from '../../upload';

export class UpdateUser implements Partial<Required$UpdateUser> {
  @IsEmpty()
  id?: string;

  @IsOptional()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
  @MinLength(validationConfig.password.minLength)
  @MaxLength(validationConfig.password.maxLength)
  @Matches(validationConfig.password.regex)
  password?: string;

  @IsOptional()
  avatar?: UploadFile | null;

  @ValidateIf(o => !!o.avatar)
  @IsNotEmpty()
  oldAvatar?: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  nickname?: string;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateUserDto extends UpdateUser
  implements Required<Omit<Required$UpdateUser, keyof UpdateUser>> {}
