import { Schema$Address, Param$CreateAddress } from '@fullstack/typings';
import { IsString, ArrayNotEmpty, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

class Excluded implements Partial<Schema$Address> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: string;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateAddress extends Excluded
  implements Partial<Omit<Param$CreateAddress, keyof Excluded>> {
  @IsString()
  @IsOptional()
  area?: string;
}

export class CreateAddressDto extends CreateAddress
  implements Required<Omit<Param$CreateAddress, keyof CreateAddress>> {
  @ArrayNotEmpty()
  @IsString({ each: true })
  address: string[];
}
