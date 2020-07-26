import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Delete
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { paths } from '@fullstack/common/constants';
import { Schema$Address, UserRole, Area } from '@fullstack/typings';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ObjectId } from '../decorators';
import { Access } from '../utils/access.guard';
import { AttachUserPipe } from '../utils/attach-user.pipe';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller(paths.address.prefix)
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(paths.address.get_addresses)
  getAddresses(@Req() req: FastifyRequest): Promise<Schema$Address[]> {
    return this.addressService.findAll({ user: req.user.user_id });
  }

  @Get(paths.address.get_address)
  getAddress(@ObjectId() id: string): Promise<Schema$Address> {
    return this.addressService.findOne({ _id: id });
  }

  @Post(paths.address.create_address)
  createAddress(
    @Body(AttachUserPipe) createAddress: CreateAddressDto
  ): Promise<Schema$Address> {
    return this.addressService.create({
      ...createAddress,
      area: Area.HongKong
    });
  }

  @Patch(paths.address.update_address)
  updateAddress(
    @ObjectId() id: string,
    @Req() req: FastifyRequest,
    @Body() updateAddress: UpdateAddressDto
  ): Promise<Schema$Address> {
    const user =
      req.user.role === UserRole.CLIENT
        ? { user: req.user.user_id }
        : undefined;

    return this.addressService.update({ _id: id, ...user }, updateAddress);
  }

  @Delete(paths.address.delete_address)
  deleteAddress(@ObjectId() id: string): Promise<void> {
    return this.addressService.delete({ _id: id });
  }
}
