import {
  prop,
  plugin,
  getModelForClass,
  ReturnPaginateModelType,
  arrayProp
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';
import {
  ProductStatus,
  Schema$Product
} from '@fullstack/common/service/typings';

export { ProductStatus } from '@fullstack/common/service/typings';

@plugin(paginate)
export class Product implements Required<Schema$Product> {
  id!: string;

  @prop({ required: true, unique: true, index: true })
  name!: string;

  @prop({ default: '' })
  description!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  amount!: number;

  @prop({ default: 0 })
  freeze!: number;

  get remain() {
    return this.amount - this.freeze;
  }

  @prop({ required: true, type: String, lowercase: true })
  category!: string;

  @arrayProp({ type: String })
  images!: string[];

  @arrayProp({ type: String, lowercase: true })
  tags!: string[];

  @prop({ default: ProductStatus.VISIBLE, type: Number })
  status!: ProductStatus;

  @prop({ default: 100, type: Number })
  discount!: number;

  createdAt!: string;

  updatedAt!: string;
}

export const ProductModel = getModelForClass(Product, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Product>;
