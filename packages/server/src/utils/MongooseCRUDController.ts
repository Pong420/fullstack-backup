import { Document, FilterQuery } from 'mongoose';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Body,
  Param,
  Get,
  Post,
  Delete,
  Query // eslint-disable-line @typescript-eslint/no-unused-vars
} from '@nestjs/common';
import { PaginateResult, Param$Pagination } from '@fullstack/typings';
import { MongooseCRUDService } from './MongooseCRUDService';
import { formatSearchQuery } from './formatSearchQuery';
import { Order, Condition } from '../typings';

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

export type QueryAll<D> = PaginationDto & SearchDto & FilterQuery<D>;

interface Options<D extends Document> {
  searchKeys?: (keyof D)[];
}

export class MongooseCRUDController<
  D extends Document,
  T extends MongooseCRUDService<D>
> {
  constructor(
    private readonly service: T,
    private readonly options: Options<D> = {}
  ) {}

  @Get()
  async getAll(@Query() query: QueryAll<D> = {}): Promise<PaginateResult<D>> {
    const {
      page = 1,
      size = 10,
      search,
      condition = [],
      sort = { createdAt: Order.DESC },
      ...fullMatches
    } = query;

    // TODO: make this better
    delete fullMatches.password;

    return this.service.paginate(
      {
        $and: [
          ...condition,
          fullMatches,
          formatSearchQuery(this.options.searchKeys as string[], search)
        ]
      },
      {
        sort,
        page,
        limit: size
      }
    );
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
