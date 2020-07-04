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

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, default: 0 })
  freeze: number;

  get remain(): number {
    return this.amount - this.freeze;
  }

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
