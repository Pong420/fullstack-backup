import { Schema$Address, Param$CreateAddress, Area } from '@fullstack/typings';
import { IsString, ArrayNotEmpty, IsOptional, IsEnum } from 'class-validator';
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
  @IsEnum(Area)
  @IsOptional()
  area?: Area;
}

export class CreateAddressDto extends CreateAddress
  implements Required<Omit<Param$CreateAddress, keyof CreateAddress>> {
  @ArrayNotEmpty()
  @IsString({ each: true })
  address: string[];
}
