import { Schema$OrderProduct, Schema$Product } from '@fullstack/typings';
import { Exclude } from 'class-transformer';

class ShouldBeExcluded
  implements Omit<Schema$Product, keyof Schema$OrderProduct> {
  @Exclude()
  freeze: number;

  @Exclude()
  remain: number;

  @Exclude()
  category: string;

  @Exclude()
  tags: string[];

  @Exclude()
  hidden: boolean;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class OrderProduct extends ShouldBeExcluded
  implements Schema$OrderProduct {
  id: string;

  name: string;

  images: string[];

  description: string;

  price: number;

  discount: number;

  amount: number;
}
