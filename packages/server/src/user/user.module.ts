import { APP_PIPE } from '@nestjs/core';
import { Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import paginate from 'mongoose-paginate-v2';
import { UserRolePipe } from './user-role.pipe';

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
  providers: [
    UserService,
    {
      provide: APP_PIPE,
      scope: Scope.REQUEST,
      useClass: UserRolePipe
    }
  ],
  exports: [UserService]
})
export class UserModule {}
