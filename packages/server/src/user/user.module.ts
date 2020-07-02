import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRolePipe } from './user-role.pipe';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async () => {
          const schema = UserSchema;
          schema.plugin(paginate);
          return schema;
        }
      }
    ]),
    CloudinaryModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRolePipe],
  exports: [UserService]
})
export class UserModule {}
