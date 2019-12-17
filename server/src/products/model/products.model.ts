import {
  prop,
  plugin,
  getModelForClass,
  ReturnPaginateModelType,
  arrayProp
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';
import { ProductStatus, Schema$Product } from 'utils';

export { ProductStatus } from 'utils';

@plugin(paginate)
export class Product implements Schema$Product {
  id!: string;

  @prop({ required: true, unique: true, index: true })
  name!: string;

  @prop({ default: '' })
  description!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  amount!: number;

  @prop({ required: true, type: String, lowercase: true })
  type!: string;

  @arrayProp({ type: String })
  images!: string[];

  @arrayProp({ type: String, lowercase: true })
  tags!: string[];

  @prop({ default: ProductStatus.VISIBLE, type: Number })
  status!: ProductStatus;

  createdAt!: string;

  updatedAt!: string;
}

export const ProductModel = getModelForClass(Product, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Product>;