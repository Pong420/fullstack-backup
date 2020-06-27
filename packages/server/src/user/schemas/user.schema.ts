import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$User, UserRole } from '@fullstack/typings';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';

function hashPassword(pwd: string) {
  return bcrypt.hashSync(pwd, 10);
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new User(raw)
  }
})
export class User implements Schema$User {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({
    type: String,
    set: hashPassword,
    get: (pwd: string) => pwd
  })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ default: UserRole.CLIENT })
  role: UserRole;

  @Prop({ default: null })
  avatar: string | null;

  @Prop({
    type: String,
    default: function () {
      return this.username;
    }
  })
  nickname: string;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<User>) {
    Object.assign(this, payload);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
