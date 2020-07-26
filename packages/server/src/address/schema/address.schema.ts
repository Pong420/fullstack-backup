import { Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema$Address } from '@fullstack/typings';
import { User } from '../../user/schemas/user.schema';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new Address(raw)
  }
})
export class Address implements Schema$Address {
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  user: string;

  @Prop({ type: String, required: true })
  area: string;

  @Prop({ type: [String], required: true })
  address: string[];

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Address>) {
    Object.assign(this, payload);
  }

  toJSON(): Address {
    return new Address(this);
  }
}

export const AddressSchema = SchemaFactory.createForClass(Address);
