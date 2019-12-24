import {
  IsString,
  IsOptional,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsInt,
  Max,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Required$UpdateProduct,
  Schema$Product,
  ProductStatus
} from '@fullstack/common/service/typings';
import { UploadFile } from '../../upload';
import { PRICE_MIN, AMOUNT_MIN, DISCOUNT_MAX, DISCOUNT_MIN } from './index';

export class UpdateProduct implements Partial<Required$UpdateProduct> {
  @IsEmpty()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(PRICE_MIN)
  @Transform(Number)
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(AMOUNT_MIN)
  @Transform(Number)
  amount?: number;

  @IsEmpty()
  freeze?: undefined;

  @IsEmpty()
  remain?: undefined;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  images?: Array<UploadFile | string>;

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

export class UpdateProductDto extends UpdateProduct
  implements
    Required<
      Omit<Schema$Product & Required$UpdateProduct, keyof UpdateProduct>
    > {}
