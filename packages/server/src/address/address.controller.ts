import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { paths } from '@fullstack/common/constants';
import { Schema$Address, UserRole, Area } from '@fullstack/typings';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ObjectId, UserId } from '../decorators';
import { Access } from '../utils/access.guard';

@Controller(paths.address.prefix)
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(paths.address.get_addresses)
  getAddresses(@UserId() user: UserId): Promise<Schema$Address[]> {
    return this.addressService.findAll(user);
  }

  @Get(paths.address.get_address)
  getAddress(
    @ObjectId() id: string,
    @UserId() user: UserId
  ): Promise<Schema$Address> {
    return this.addressService.findOne({ _id: id, ...user });
  }

  @Post(paths.address.create_address)
  createAddress(
    @Body() createAddress: CreateAddressDto,
    @UserId() user: UserId
  ): Promise<Schema$Address> {
    return this.addressService.create({
      ...createAddress,
      ...user,
      area: Area.HongKong
    });
  }

  @Patch(paths.address.update_address)
  updateAddress(
    @ObjectId() id: string,
    @Body() updateAddress: UpdateAddressDto,
    @UserId([UserRole.CLIENT]) user: UserId
  ): Promise<Schema$Address> {
    try {
      return this.addressService.update({ _id: id, ...user }, updateAddress);
    } catch (error) {
      throw error;
    }
  }

  @Delete(paths.address.delete_address)
  deleteAddress(
    @ObjectId() id: string,
    @UserId([UserRole.CLIENT]) user: UserId
  ): Promise<void> {
    return this.addressService.delete({ _id: id, ...user });
  }
}
