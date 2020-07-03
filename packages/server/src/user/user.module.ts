import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRolePipe } from './user-role.pipe';
import { Model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [CloudinaryModule],
        inject: [CloudinaryService],
        name: User.name,
        useFactory: async (cloudinaryService: CloudinaryService) => {
          const schema = UserSchema as Schema<User>;
          async function removeImageFromCloudinary() {
            const model: Model<User & Document> = (this as any).model;
            const pre = await model.findOne(this.getQuery());
            if (pre.avatar) {
              await cloudinaryService.remove(pre.avatar).toPromise();
            }
          }
          schema.plugin(paginate);
          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', removeImageFromCloudinary);
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
