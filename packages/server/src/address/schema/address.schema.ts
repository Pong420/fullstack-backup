import { Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema$Address, Area } from '@fullstack/typings';
import { User } from '../../user/schemas/user.schema';
import { Group } from '../../utils/access.guard';

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
  @Group(['ADMIN', 'MANAGER', 'GUEST'])
  user: string;

  @Prop({ type: String, required: true })
  area: Area;

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
