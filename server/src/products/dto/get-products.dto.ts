import { IsOptional } from 'class-validator';

export class GetProductsDto {
  @IsOptional()
  tag?: string;

  @IsOptional()
  type?: string;
}
