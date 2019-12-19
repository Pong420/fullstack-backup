import {
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsEmpty,
  ValidateIf
} from 'class-validator';
import { Required$UpdateUser, UserRole } from '@fullstack/service';
import { UploadFile } from '../../upload';

export class UpdateUser implements Partial<Required$UpdateUser> {
  @IsEmpty()
  id?: string;

  @IsOptional()
  email?: string;

  @IsEmpty()
  username?: string;

  @IsOptional()
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
