import { prop, getModelForClass } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

function hashPassword(pwd: string) {
  return bcrypt.hashSync(pwd, 10);
}

export class User {
  id!: string;

  @prop({ required: true, index: true, unique: true })
  username!: string;

  @prop({ required: true, set: hashPassword, get: pwd => pwd })
  password!: string;

  @prop({ required: true })
  role!: string;

  createdAt!: string;

  updatedAt!: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
});
