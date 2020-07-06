import {
  Schema$Product,
  Param$GetProducts,
  Timestamp
} from '@fullstack/typings';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Hidden, Tags } from './products.decorators';
import { QueryDto } from '../../utils/mongoose-crud.service';
import { NumberRannge } from '../../decorators/range.decorator';

class Base extends QueryDto
  implements Partial<Omit<Param$GetProducts, keyof Timestamp>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  images?: undefined;
}

class QueryProduct extends Base
  implements Partial<Omit<Param$GetProducts | Schema$Product, keyof Base>> {
  @IsString()
  @IsOptional()
  name?: string;

  @NumberRannge()
  @IsOptional()
  price?: number;

  @NumberRannge()
  @IsOptional()
  amount?: number;

  @NumberRannge()
  @IsOptional()
  freeze?: undefined;

  @NumberRannge()
  @IsOptional()
  remain?: undefined;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @Tags()
  @IsOptional()
  tags?: string[];

  @Hidden()
  @IsOptional()
  hidden?: boolean;

  @NumberRannge()
  @IsOptional()
  discount?: number;
}

export class QueryProductDto extends QueryProduct
  implements
    Required<Omit<Param$GetProducts & Schema$Product, keyof QueryProduct>> {}
