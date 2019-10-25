import { prop, getModelForClass } from '@typegoose/typegoose';

export class RefreshToken {
  id!: string;

  @prop({ required: true })
  refreshToken!: string;

  createdAt!: string;

  updatedAt!: string;
}

export const RefreshTokenModel = getModelForClass(RefreshToken, {
  schemaOptions: { timestamps: true }
});
