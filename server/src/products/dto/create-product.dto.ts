import {
  IsString,
  IsOptional,
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UploadFile } from '../../upload';
import { Required$CreateProduct, Schema$Product, ProductStatus } from 'utils';

export class Base implements Required<Required$CreateProduct> {
  @IsString()
  name!: string;

  @IsNumber()
  @Transform(Number)
  price!: number;

  @IsNumber()
  @Transform(Number)
  amount!: number;
}

export class CreateProduct extends Base
  implements
    Partial<Omit<Schema$Product | Required$CreateProduct, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  freeze!: number;

  @IsEmpty()
  remain!: number;

  @IsString()
  type!: string;

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

  @IsEmpty()
  createdAt?: string;

  @IsEmpty()
  updatedAt?: string;
}

export class CreateProductDto extends CreateProduct
  implements
    Required<
      Omit<Schema$Product & Required$CreateProduct, keyof CreateProduct>
    > {}
