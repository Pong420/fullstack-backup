import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$Product } from '@fullstack/typings';

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
  amount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  freeze: number;

  @Prop({
    default: function () {
      return this.amount - this.freeze;
    }
  })
  remain: number;

  @Prop({ type: String, required: true, lowercase: true })
  category: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: [String], lowercase: true })
  tags: string[];

  @Prop({ type: Boolean, default: false })
  hidden: boolean;

  @Prop({ type: Number, default: 100 })
  discount: number;

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
