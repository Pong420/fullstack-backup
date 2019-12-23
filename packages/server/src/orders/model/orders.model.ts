import {
  prop,
  arrayProp,
  plugin,
  getModelForClass,
  Ref,
  ReturnPaginateModelType
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';
import { Product } from '../../products/model';
import { User } from '../../user/model';
import { OrderStatus, Schema$Order } from '@fullstack/common/service/typings';

@plugin(paginate)
export class Order implements Schema$Order {
  @arrayProp({ itemsRef: Product, required: true })
  // eslint-disable-next-line
  // @ts-ignore
  products!: Ref<Schema$Order['product'][number]>[];

  @prop({ ref: User })
  // eslint-disable-next-line
  // @ts-ignore
  user!: Ref<Schema$Order['user']>;

  @prop({ default: OrderStatus.PENDING, type: Number })
  status!: OrderStatus;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Order>;
