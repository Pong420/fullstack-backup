import {
  prop,
  plugin,
  getModelForClass,
  ReturnPaginateModelType
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';

@plugin(paginate)
export class Product {
  @prop({ required: true, unique: true, index: true })
  name!: string;

  @prop({ default: '' })
  description!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  amount!: number;

  @prop({ required: true })
  type!: string;

  @prop({ default: [] })
  images!: string[];

  @prop({ default: [] })
  tags!: string[];

  @prop({ default: false })
  hidden!: boolean;
}

export const ProductModel = getModelForClass(Product, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof Product>;
