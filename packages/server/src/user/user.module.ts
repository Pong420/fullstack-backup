import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRolePipe } from './user-role.pipe';
import { Model, Schema, Document, Query } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [CloudinaryModule],
        inject: [CloudinaryService],
        name: User.name,
        useFactory: async (cloudinaryService: CloudinaryService) => {
          async function removeImageFromCloudinary(this: Query<unknown>) {
            const model: Model<User & Document> = (this as any).model;
            const current = await model.findOne(this.getQuery());
            if (current.avatar) {
              await cloudinaryService.remove(current.avatar).toPromise();
            }
          }

          const schema = UserSchema as Schema<User>;
          schema.plugin(paginate);
          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', async function () {
            const update: Partial<User> = this.getUpdate();
            if (update.avatar) {
              await removeImageFromCloudinary.call(this);
            }
          });
          return schema;
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, UserRolePipe],
  exports: [UserService]
})
export class UserModule {}
