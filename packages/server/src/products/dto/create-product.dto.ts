import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Schema$Product } from '@fullstack/typings';
import { Price, Amount, Disscount, Hidden, Tags } from './products.decorators';

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
  images?: string[];

  @IsOptional()
  @Tags()
  tags?: string[];

  @IsOptional()
  @Hidden()
  hidden?: boolean;

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
