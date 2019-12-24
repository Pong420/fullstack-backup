import { IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Required$CreateOrder } from '@fullstack/common/service/typings';

type OrderProduct = Required$CreateOrder['products'][number];

export class OrderProductDto implements OrderProduct {
  @IsString()
  product!: string;

  @IsInt()
  @Transform(Number)
  amount!: number;
}
