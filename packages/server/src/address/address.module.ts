import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address, AddressSchema } from './schema/address.schema';
import { AttachUserPipe } from '../utils/attach-user.pipe';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Address.name,
        useFactory: async () => {
          const schema = AddressSchema as Schema<Address>;
          return schema;
        }
      }
    ])
  ],
  providers: [AddressService, AttachUserPipe],
  controllers: [AddressController]
})
export class AddressModule {}
