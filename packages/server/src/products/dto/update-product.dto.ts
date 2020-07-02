import { IsString, IsOptional, IsArray } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Schema$Product, ProductStatus } from '@fullstack/typings';
import { Price, Amount, Disscount, Status, Tags } from './products.decorators';

class Base implements Partial<Schema$Product> {
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

class UpdateProduct extends Base
  implements Partial<Omit<Schema$Product, keyof Base>> {
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

  @Status()
  @IsOptional()
  status?: ProductStatus;

  @Disscount()
  @IsOptional()
  discount?: number;
}

export class UpdateProductDto extends UpdateProduct
  implements Required<Omit<Schema$Product, keyof UpdateProduct>> {}
