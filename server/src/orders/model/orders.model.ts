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

@plugin(paginate)
export class Order {
  @prop({ ref: Product, required: true })
  product!: Ref<Product>;

  @prop({ ref: User })
  user!: Ref<User>;

  @prop({ required: true })
  amount!: number;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Order>;
