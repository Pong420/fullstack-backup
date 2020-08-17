import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema$Order, OrderStatus } from '@fullstack/typings';
import { OrderProduct } from './order-product';
import { OrderUser } from './order-user';
import { User } from '../../user/schemas/user.schema';
import { Group } from '../../utils/access.guard';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Order(raw)
  }
})
export class Order implements Schema$Order<string> {
  id: string;

  @Prop({ required: true })
  @Type(() => OrderProduct)
  products: OrderProduct[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  @Type(() => OrderUser)
  @Group(['ADMIN', 'MANAGER'])
  user: string;

  @Prop({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: String })
  address: string;

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
