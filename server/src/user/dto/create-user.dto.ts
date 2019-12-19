import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsEmpty
} from 'class-validator';
import { Required$CreateUser, Schema$User, UserRole } from '@fullstack/service';
import { UploadFile } from '../../upload';

class Base implements Required$CreateUser {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

class CreateUser extends Base
  implements Partial<Omit<Schema$User | Required$CreateUser, keyof Base>> {
  @IsEmpty()
  id?: string;

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
