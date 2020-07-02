import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsLowercase
} from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import { Schema$Product, ProductStatus } from '@fullstack/typings';
import { Price, Amount, Disscount } from './constants';

export class Base implements Partial<Schema$Product> {
  @Exclude()
  id?: undefined;

  @Exclude()
  freeze: undefined;

  @Exclude()
  remain: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class CreateProduct extends Base
  implements Partial<Omit<Schema$Product, keyof Base>> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ProductStatus)
  @Transform(Number)
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

  @IsArray()
  @IsString()
  @IsLowercase({ each: true })
  // TODO: test
  @Transform(arr => arr.map((s: string) => s.toLowerCase()))
  category: string;
}
