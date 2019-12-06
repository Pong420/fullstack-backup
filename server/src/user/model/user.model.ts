import { IsEmail } from 'class-validator';
import { prop, getModelForClass } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

function hashPassword(pwd: string) {
  return bcrypt.hashSync(pwd, 10);
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client'
}

export class User {
  id!: string;

  @prop({ required: true, unique: true })
  @IsEmail()
  email!: string;

  @prop({ required: true, unique: true })
  username!: string;

  @prop({ required: true, set: hashPassword, get: pwd => pwd })
  password!: string;

  @prop({ enum: UserRole, default: UserRole.CLIENT })
  role!: UserRole;

  @prop()
  nickname!: string;

  @prop({ default: null })
  avatar!: string | null;

  createdAt!: string;

  updatedAt!: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
});
