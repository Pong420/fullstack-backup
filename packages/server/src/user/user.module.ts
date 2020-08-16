import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema$User } from '@fullstack/typings';
import {
  Model,
  Schema,
  Document,
  Query,
  MongooseFuzzySearchingField
} from 'mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRolePipe } from './user-role.pipe';
import { User, UserSchema } from './schemas/user.schema';
import { fuzzySearch } from '../utils/mongoose-fuzzy-search';
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

          const fields: MongooseFuzzySearchingField<Schema$User>[] = [
            { name: 'username' },
            { name: 'nickname' },
            { name: 'email', escapeSpecialCharacters: false }
          ];

          schema.plugin(fuzzySearch, { fields });

          schema.plugin(paginate);

          async function removeImageFromCloudinary(this: Query<unknown>) {
            const model: Model<User & Document> = (this as any).model;
            const user = await model.findOne(this.getQuery());
            if (user?.avatar) {
              await cloudinaryService.remove(user.avatar).toPromise();
            }
          }

          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', async function () {
            const changes: Partial<User> = this.getUpdate();
            if (typeof changes?.avatar !== 'undefined') {
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
