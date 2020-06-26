import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  Query, // eslint-disable-line @typescript-eslint/no-unused-vars
  NotFoundException
} from '@nestjs/common';
import { PaginateResult, Param$Pagination } from '@fullstack/typings';
import { MongooseCRUDService } from './MongooseCRUDService';
import { ParseObjectIdPipe } from './ParseObjectIdPipe';
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

interface Options<T> {
  searchKeys?: (keyof T)[];
}

export class MongooseCRUDController<T, D extends T & Document = T & Document> {
  constructor(
    private readonly service: MongooseCRUDService<T, D>,
    private readonly options: Options<T> = {}
  ) {}

  @Get()
  async getAll(@Query() query: QueryAll<D> = {}): Promise<PaginateResult<T>> {
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
  async create(@Body() createDto: unknown): Promise<T> {
    return this.service.create(createDto);
  }

  @Get(':id')
  async get(@Param('id', new ParseObjectIdPipe()) id: string): Promise<T> {
    const result = await this.service.findOne({ _id: id } as FilterQuery<D>);
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() changes: UpdateQuery<D>
  ): Promise<T> {
    return this.service.update({ _id: id } as any, changes);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string
  ): Promise<void> {
    await this.service.delete({ _id: id } as FilterQuery<D>);
  }
}
