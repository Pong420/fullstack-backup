import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Query, // eslint-disable-line @typescript-eslint/no-unused-vars
  NotFoundException
} from '@nestjs/common';
import { PaginateResult, Param$Pagination } from '@fullstack/typings';
import { MongooseCRUDService, QueryDto } from './MongooseCRUDService';
import { ObjectId } from '../decorators';
import { Condition } from '../typings';

export { PaginateResult, QueryDto, ObjectId };

type Schema = { [K in keyof Param$Pagination]: unknown };
export class PaginationDto implements Schema {
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  size?: number;

  @IsOptional()
  sort?: string | Record<string, unknown>;

  @IsOptional()
  condition?: Condition[];
}

export class SearchDto {
  @IsOptional()
  search?: string;
}

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
