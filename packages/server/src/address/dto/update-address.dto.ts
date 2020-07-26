import {
  Param$UpdateAddress,
  Schema$Address,
  DTOExcluded
} from '@fullstack/typings';
import { IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

type Schema = Schema$Address & Param$UpdateAddress;

class Excluded implements DTOExcluded<Schema$Address, Param$UpdateAddress> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  area?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateAddress extends Excluded
  implements Partial<Omit<Schema, keyof Excluded | keyof UpdateAddressDto>> {
  @IsOptional()
  @IsString({ each: true })
  address?: string[];
}

export class UpdateAddressDto extends UpdateAddress
  implements Required<Omit<Schema, keyof UpdateAddress>> {}
