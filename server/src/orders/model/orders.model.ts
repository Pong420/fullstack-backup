import {
  prop,
  plugin,
  getModelForClass,
  Ref,
  ReturnPaginateModelType
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';
import { Product } from '../../products/model';
import { User } from '../../user/model';
import { OrderStatus, Schema$Order } from 'utils';

@plugin(paginate)
export class Order implements Schema$Order {
  @prop({ ref: Product, required: true })
  // eslint-disable-next-line
  // @ts-ignore
  product!: Ref<Product>;

  @prop({ ref: User })
  // eslint-disable-next-line
  // @ts-ignore
  user!: Ref<User>;

  @prop({ required: true })
  amount!: number;

  @prop({ default: OrderStatus.PENDING, type: Number })
  status!: OrderStatus;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Order>;
