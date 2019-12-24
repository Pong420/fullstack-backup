import {
  IsString,
  IsOptional,
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsInt,
  Max,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Required$CreateProduct,
  Schema$Product,
  ProductStatus
} from '@fullstack/common/service/typings';
import { UploadFile } from '../../upload';
import { PRICE_MIN, AMOUNT_MIN, DISCOUNT_MAX, DISCOUNT_MIN } from './index';

export class Base implements Required<Required$CreateProduct> {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(PRICE_MIN)
  @Transform(Number)
  price!: number;

  @IsInt()
  @Min(AMOUNT_MIN)
  @Transform(Number)
  amount!: number;
}

export class CreateProduct extends Base
  implements
    Partial<Omit<Schema$Product | Required$CreateProduct, keyof Base>> {
  @IsEmpty()
  id?: undefined;

  @IsEmpty()
  freeze!: undefined;

  @IsEmpty()
  remain!: undefined;

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: UploadFile[];

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ProductStatus)
  @Transform(Number)
  status?: ProductStatus;

  @IsOptional()
  @IsInt()
  @Max(DISCOUNT_MIN)
  @Min(DISCOUNT_MAX)
  @Transform(Number)
  discount?: number;

  @IsEmpty()
  createdAt?: undefined;

  @IsEmpty()
  updatedAt?: undefined;
}

export class CreateProductDto extends CreateProduct
  implements
    Required<
      Omit<Schema$Product & Required$CreateProduct, keyof CreateProduct>
    > {}
