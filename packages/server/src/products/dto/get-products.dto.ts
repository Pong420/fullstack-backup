import { IsOptional } from 'class-validator';
import { Required$GetProducts } from '@fullstack/common/service/typings';

export class GetProducts implements Required$GetProducts {
  @IsOptional()
  tag?: string;

  @IsOptional()
  type?: string;
}

export class GetProductsDto extends GetProducts
  implements Required<Omit<Required$GetProducts, keyof GetProducts>> {}
