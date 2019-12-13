import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { UploadFile, ResponsiveImage } from '../../upload';
import { Product } from '../model';

export class UpdateProductDto implements Omit<Partial<Product>, 'images'> {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @IsNotEmpty()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  images?: Array<UploadFile | ResponsiveImage>;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
