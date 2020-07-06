import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  DTOExcluded,
  Schema$RefreshToken,
  Param$CreateRefreshToken
} from '@fullstack/typings';

type Schema = Schema$RefreshToken & Param$CreateRefreshToken;

class Excluded implements DTOExcluded<Schema> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user_id?: undefined;

  @Exclude()
  username?: undefined;

  @Exclude()
  nickname?: undefined;

  @Exclude()
  role?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class UpdateRefreshTokenDto extends Excluded
  implements Required<Omit<Schema$RefreshToken, keyof Excluded>> {
  @IsString()
  refreshToken: string;
}
