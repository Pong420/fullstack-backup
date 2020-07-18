import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$Product } from '@fullstack/typings';
import { Group } from '../../utils/access.guard';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Product(raw)
  }
})
export class Product implements Schema$Product {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, required: true, min: 0 })
  @Group(['ADMIN', 'MANAGER'])
  amount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  @Group(['ADMIN', 'MANAGER'])
  freeze: number;

  @Group(['ADMIN', 'MANAGER', 'GUEST'])
  remain: number;

  @Prop({ type: String, required: true, lowercase: true })
  category: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: [String], lowercase: true })
  tags: string[];

  @Prop({ type: Boolean, default: false })
  @Group(['ADMIN', 'MANAGER'])
  hidden: boolean;

  @Prop({ type: Number, default: 100 })
  discount: number;

  @Group(['ADMIN', 'MANAGER'])
  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Product>) {
    Object.assign(this, payload);
  }

  toJSON(): Product {
    return new Product(this);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);

const remain: keyof Product = 'remain';
ProductSchema.virtual(remain).get(function () {
  return this.amount - this.freeze;
});
