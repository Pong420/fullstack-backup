import { IsString, IsOptional, IsArray } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Product,
  DTOExcluded,
  Param$UpdateProduct
} from '@fullstack/typings';
import { Price, Amount, Disscount, Tags, Hidden } from './products.decorators';

class Excluded implements DTOExcluded<Schema$Product, Param$UpdateProduct> {
  @Exclude()
  id?: undefined;

  @Exclude()
  freeze?: undefined;

  @Exclude()
  remain?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateProduct extends Excluded
  implements Partial<Omit<Schema$Product, keyof Excluded>> {
  @IsString()
  @IsOptional()
  name?: string;

  @Price()
  @IsOptional()
  price?: number;

  @Amount()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @Tags()
  @IsOptional()
  tags?: string[];

  @Hidden()
  @IsOptional()
  hidden?: boolean;

  @Disscount()
  @IsOptional()
  discount?: number;
}

export class UpdateProductDto extends UpdateProduct
  implements Required<Omit<Schema$Product, keyof UpdateProduct>> {}
