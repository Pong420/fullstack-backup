import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';
import {
  Required$CreateUser,
  Schema$User,
  UserRole
} from '@fullstack/common/service/typings';
import { validationConfig } from '@fullstack/common/utils/validationConfig';
import { UploadFile } from '../../upload';

const { username, password } = validationConfig;

class Base implements Required$CreateUser {
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  username!: string;

  @IsString()
  @MinLength(password.minLength)
  @MaxLength(password.maxLength)
  @Matches(password.regex)
  password!: string;

  @IsEmail()
  email!: string;
}

class CreateUser extends Base
  implements Partial<Omit<Schema$User | Required$CreateUser, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role!: UserRole;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  avatar?: UploadFile;

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class CreateUserDto extends CreateUser
  implements
    Required<Omit<Schema$User & Required$CreateUser, keyof CreateUser>> {}
