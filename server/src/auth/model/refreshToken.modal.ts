import { prop, getModelForClass } from '@typegoose/typegoose';
import { JWTSignPayload } from '../interfaces/jwt.interfaces';
import { Role } from '../../typings';

export class RefreshToken implements JWTSignPayload {
  id!: string;

  @prop({ required: true })
  username!: string;

  @prop()
  role?: Role;

  @prop({ required: true })
  refreshToken!: string;

  createdAt!: string;

  updatedAt!: string;
}

export const RefreshTokenModel = getModelForClass(RefreshToken, {
  schemaOptions: { timestamps: true }
});
