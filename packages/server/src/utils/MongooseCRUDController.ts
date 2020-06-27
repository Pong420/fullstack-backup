import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import {
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Query, // eslint-disable-line @typescript-eslint/no-unused-vars
  NotFoundException
} from '@nestjs/common';
import { PaginateResult } from '@fullstack/typings';
import { MongooseCRUDService, QueryDto } from './MongooseCRUDService';
import { ObjectId } from '../decorators';

export { PaginateResult, QueryDto, ObjectId };

export class MongooseCRUDController<T, D extends T & Document = T & Document> {
  constructor(private readonly service: MongooseCRUDService<T, D>) {}

  @Get()
  async getAll(@Query() query: QueryDto): Promise<PaginateResult<T>> {
    return this.service.paginate(query);
  }

  @Post()
  async create(@Body() createDto: unknown): Promise<T> {
    return this.service.create(createDto);
  }

  @Get(':id')
  async get(@ObjectId() id: string): Promise<T> {
    const result = await this.service.findOne({ _id: id } as FilterQuery<D>);
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }

  @Patch(':id')
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateQuery<D>
  ): Promise<T> {
    return this.service.update({ _id: id } as any, changes);
  }

  @Delete(':id')
  async delete(@ObjectId() id: string): Promise<void> {
    await this.service.delete({ _id: id } as FilterQuery<D>);
  }
}
