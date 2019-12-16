import { IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  product!: string;

  @IsEmpty()
  user!: string;

  @IsNotEmpty()
  amount!: number;
}
