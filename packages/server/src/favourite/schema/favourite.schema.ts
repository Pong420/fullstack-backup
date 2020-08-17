import { Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema$Favourite, Schema$Product } from '@fullstack/typings';
import { User } from '../../user/schemas/user.schema';
import { Product } from '../../products/schemas/products.schema';
import { Group } from '../../utils/access.guard';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Favourite(raw)
  }
})
export class Favourite implements Schema$Favourite {
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  @Group(['ADMIN', 'MANAGER', 'GUEST'])
  user: string;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
    autopopulate: true
  })
  product: Schema$Product;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Favourite>) {
    Object.assign(this, payload);
  }

  toJSON(): Favourite {
    return new Favourite(this);
  }
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
