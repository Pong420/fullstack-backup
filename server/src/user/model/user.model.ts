import { IsEmail } from 'class-validator';
import {
  prop,
  plugin,
  getModelForClass,
  ReturnPaginateModelType
} from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import paginate from 'mongoose-paginate-v2';
import { UserRole, Schema$User } from '@fullstack/typings';

export { UserRole } from '@fullstack/typings';

function hashPassword(pwd: string) {
  return bcrypt.hashSync(pwd, 10);
}

@plugin(paginate)
export class User implements Schema$User {
  id!: string;

  @prop({ required: true, unique: true })
  @IsEmail()
  email!: string;

  @prop({ required: true, unique: true })
  username!: string;

  @prop({ required: true, set: hashPassword, get: pwd => pwd, select: false })
  password!: string;

  @prop({ enum: UserRole, default: UserRole.CLIENT, type: String })
  role!: UserRole;

  @prop({ text: true })
  nickname!: string;

  @prop({ default: null })
  avatar!: string | null;

  createdAt!: string;

  updatedAt!: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
}) as ReturnPaginateModelType<typeof User>;
