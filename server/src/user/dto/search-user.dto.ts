import { IsOptional } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  search?: string;
}
