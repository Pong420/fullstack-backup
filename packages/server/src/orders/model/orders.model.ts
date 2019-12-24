import {
  prop,
  arrayProp,
  plugin,
  getModelForClass,
  Ref,
  ReturnPaginateModelType,
  modelOptions
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';
import { Product } from '../../products/model';
import { User } from '../../user/model';
import { OrderStatus, Schema$Order } from '@fullstack/common/service/typings';

export type OrderProductType = Schema$Order['products'][number];

// this remove virtual `id`
@modelOptions({ schemaOptions: { toJSON: { virtuals: false } } })
export class OrderProduct implements Record<keyof OrderProductType, unknown> {
  @prop({ ref: Product, required: true })
  product!: Ref<OrderProductType['product']>;

  @prop({ required: true })
  amount!: number;
}

@plugin(paginate)
export class Order implements Record<keyof Schema$Order, unknown> {
  id!: string;

  @arrayProp({ _id: false, type: OrderProduct, required: true })
  products!: OrderProduct[];

  @prop({ ref: User })
  user!: Ref<Schema$Order['user']>;

  @prop({ default: OrderStatus.PENDING, type: Number })
  status!: OrderStatus;

  createdAt!: string;

  updatedAt!: string;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Order>;
