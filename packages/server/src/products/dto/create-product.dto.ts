import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
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

class CreateProduct extends Base
  implements Partial<Omit<Schema$Product, keyof Base>> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  // TODO:
  images?: string[];

  @IsOptional()
  @Tags()
  tags?: string[];

  @IsOptional()
  @Status()
  status?: ProductStatus;

  @IsOptional()
  @Disscount()
  discount?: number;
}

export class CreateProductDto extends CreateProduct
  implements Required<Omit<Schema$Product, keyof CreateProduct>> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Price()
  price: number;

  @Amount()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}