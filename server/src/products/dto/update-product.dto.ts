import {
  IsString,
  IsOptional,
  IsEmpty,
  IsEnum,
  IsNumber
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UploadFile } from '../../upload';
import {
  Required$UpdateProduct,
  Schema$Product,
  ProductStatus
} from '@fullstack/typings';

export class UpdateProduct implements Partial<Required$UpdateProduct> {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  amount?: number;

  @IsEmpty()
  freeze?: number;

  @IsEmpty()
  remain?: number;

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

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class UpdateProductDto extends UpdateProduct
  implements
    Required<
      Omit<Schema$Product & Required$UpdateProduct, keyof UpdateProduct>
    > {}
