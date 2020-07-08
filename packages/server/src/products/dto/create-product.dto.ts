import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Product,
  Param$CreateOrder,
  DTOExcluded
} from '@fullstack/typings';
import {
  Price,
  Amount,
  Disscount,
  Hidden,
  Tags,
  Images
} from './products.decorators';

class Excluded implements DTOExcluded<Schema$Product & Param$CreateOrder> {
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

class CreateProduct extends Excluded
  implements Partial<Omit<Schema$Product, keyof Excluded>> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Images()
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
