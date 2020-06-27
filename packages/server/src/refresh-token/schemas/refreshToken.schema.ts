import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole, Schema$RefreshToken } from '@fullstack/typings';

@Schema({ timestamps: true })
export class RefreshToken implements Schema$RefreshToken {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  user_id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ required: true })
  role: UserRole;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  createdAt: string;

  updatedAt: string;
}

export class RefreshTokenModel extends Document {}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
