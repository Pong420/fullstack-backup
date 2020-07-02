import {
  Schema$Product,
  Param$GetProducts,
  ProductStatus,
  Timestamp
} from '@fullstack/typings';
import { QueryDto } from '../../utils/mongoose-crud.service';
import { Exclude } from 'class-transformer';
import { Status, Disscount, Price, Amount, Tags } from './products.decorators';
import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';

class Base extends QueryDto
  implements Partial<Omit<Param$GetProducts, keyof Timestamp>> {
  @Exclude()
  id?: undefined;
}

class QueryProduct extends Base
  implements Partial<Omit<Param$GetProducts | Schema$Product, keyof Base>> {
  @IsString()
  @IsOptional()
  name?: string;

  @Price()
  @IsOptional()
  price?: number;

  @Amount()
  @IsOptional()
  amount?: number;

  @IsInt()
  @IsOptional()
  freeze?: undefined;

  @IsInt()
  @IsOptional()
  remain?: undefined;

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

export class QueryProductDto extends QueryProduct
  implements
    Required<Omit<Param$GetProducts & Schema$Product, keyof QueryProduct>> {}
