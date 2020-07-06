import { Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema$Order, OrderStatus } from '@fullstack/typings';
import { User } from '../../user/schemas/user.schema';
import { OrderProduct } from './order-product';
import { OrderUser } from './order-user';
import { Type } from 'class-transformer';
import { Group } from 'src/utils/access.guard';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Order(raw)
  }
})
export class Order implements Schema$Order {
  id: string;

  @Prop({ required: true })
  @Type(() => OrderProduct)
  products: OrderProduct[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: true
  })
  @Type(() => OrderUser)
  @Group(['ADMIN', 'MANAGER'])
  user: OrderUser;

  @Prop({ default: OrderStatus.PENDING })
  status: OrderStatus;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Order>) {
    Object.assign(this, payload);
  }

  toJSON(): Order {
    return new Order(this);
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);
