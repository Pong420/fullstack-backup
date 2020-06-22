import { Document, FilterQuery } from 'mongoose';
import { Body, Param, Get, Post, Delete } from '@nestjs/common';
import { PaginateResult } from '@fullstack/typings';
import { MongooseCRUDService } from './MongooseCRUDService';

export class MongooseCRUDConroller<
  D extends Document,
  T extends MongooseCRUDService<D>
> {
  constructor(private readonly service: T) {}

  @Get()
  async getAll(): Promise<PaginateResult<D>> {
    return this.service.paginate();
  }

  @Post()
  async create(@Body() createDto: unknown): Promise<D> {
    return this.service.create(createDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete({ _id: id } as FilterQuery<D>);
  }
}
