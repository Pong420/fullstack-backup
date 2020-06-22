import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema$User, UserRole, MongoSchema } from '@fullstack/typings';

@Schema({ timestamps: true })
export class User extends Document implements MongoSchema<Schema$User> {
  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  email: string;

  @Prop({ default: UserRole.CLIENT })
  role: UserRole;

  @Prop()
  avatar: string;

  @Prop(String)
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
