import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { MongooseCRUDService } from 'src/utils/mongoose-crud.service';
import { Address } from './schema/address.schema';

@Injectable()
export class AddressService extends MongooseCRUDService<Address> {
  constructor(
    @InjectModel(Address.name) addressModel: PaginateModel<Address & Document>
  ) {
    super(addressModel);
  }
}
