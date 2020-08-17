import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address, AddressSchema } from './schema/address.schema';

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
  providers: [AddressService],
  controllers: [AddressController]
})
export class AddressModule {}
