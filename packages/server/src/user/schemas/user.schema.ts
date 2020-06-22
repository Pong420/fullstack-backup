import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$User, UserRole, MongoSchema } from '@fullstack/typings';
import bcrypt from 'bcrypt';

function hashPassword(pwd: string) {
  return bcrypt.hashSync(pwd, 10);
}

@Schema({ timestamps: true })
export class User extends Document implements MongoSchema<Schema$User> {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({
    type: String,
    select: false,
    set: hashPassword,
    get: (pwd: string) => pwd
  })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ default: UserRole.CLIENT })
  role: UserRole;

  @Prop()
  avatar: string;

  @Prop({ type: String })
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
