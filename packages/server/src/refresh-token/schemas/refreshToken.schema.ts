import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@fullstack/typings';
import { JWTSignPayload } from 'src/typings';

@Schema({ timestamps: true })
export class RefreshToken implements JWTSignPayload {
  @Prop({ type: String, required: true, unique: true })
  user_id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ required: true })
  role: UserRole;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: Date, default: Date.now })
  expires: Date | string;
}

export class RefreshTokenModel extends Document {}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
