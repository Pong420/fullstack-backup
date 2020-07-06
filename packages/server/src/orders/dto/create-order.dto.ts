import { Param$CreateOrder, Schema$Order } from '@fullstack/typings';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  IsArray
} from 'class-validator';
import { Transform, Exclude, Type } from 'class-transformer';

type Field = Param$CreateOrder['products'][number];

class ProductField implements Field {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsInt()
  @Transform(Number)
  amount: number;
}

class Excluded implements Partial<Schema$Order> {
  @Exclude()
  id?: undefined;

  @Exclude()
  price?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateOrder extends Excluded
  implements Partial<Omit<Param$CreateOrder, keyof Excluded>> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductField)
  products: ProductField[];
}

export class CreateOrderDto extends CreateOrder
  implements Required<Omit<Param$CreateOrder, keyof CreateOrder>> {}
