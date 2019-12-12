import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { UploadFile } from '../../upload';
import { Product } from '../model';

export class CreateProductDto implements Omit<Partial<Product>, 'images'> {
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsNotEmpty()
  price!: number;

  @IsNotEmpty()
  amount!: number;

  @IsString()
  type!: string;

  @IsOptional()
  images?: UploadFile[];

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
