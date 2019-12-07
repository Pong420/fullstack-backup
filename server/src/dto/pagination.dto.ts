import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  pageNo?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  pageSize?: number;
}
