import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  Schema$User,
  Param$GetUsers,
  UserRole,
  DTOExcluded
} from '@fullstack/typings';
import { QueryDto } from '../../utils/mongoose-crud.service';

class Excluded extends QueryDto
  implements DTOExcluded<Schema$User, Param$GetUsers> {
  @Exclude()
  password?: string;

  @Exclude()
  avatar?: string;
}

class QueryUser extends Excluded
  implements Partial<Omit<Param$GetUsers | Schema$User, keyof Excluded>> {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;
}

export class QueryUserDto extends QueryUser
  implements Required<Omit<Param$GetUsers & Schema$User, keyof QueryUser>> {}
