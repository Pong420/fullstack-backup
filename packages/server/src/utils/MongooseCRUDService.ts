import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginateResult, Param$Pagination } from '@fullstack/typings';
import { Condition, Order } from '../typings';
import { formatSearchQuery } from './formatSearchQuery';

class SearchDto {
  search?: string;
}

type PaginationDto = { [K in keyof Param$Pagination]: unknown };

export class QueryDto implements PaginationDto, SearchDto {
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  size?: number;

  @IsOptional()
  @IsEnum(Order)
  sort?: string | Record<string, unknown>;

  @IsOptional()
  @IsArray()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;
}

// type T1 = QueryDto['page'];

interface Options<T> {
  searchKeys?: (keyof T)[];
}

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(
    private model: PaginateModel<D>,
    private readonly options: Options<T> = {}
  ) {}

  async create(createDto: unknown): Promise<T> {
    const createdCat = new this.model(createDto);
    return createdCat.save();
  }

  async delete(query: FilterQuery<D>): Promise<T> {
    return this.model.findOneAndDelete(query);
  }

  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<T> {
    return this.model.findOneAndUpdate(query, changes, {
      ...options,
      new: true
    });
  }

  async findOne(
    { id, ...query }: FilterQuery<T>,
    projection: any = ''
  ): Promise<T> {
    return this.model.findOne(
      JSON.parse(JSON.stringify({ _id: id, ...query })),
      projection
    );
  }

  async findAll(query?: FilterQuery<D>): Promise<T[]> {
    return this.model.find(query).exec();
  }

  paginate(
    query?: QueryDto,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    const {
      page = 1,
      size = 10,
      search,
      condition = [],
      sort = { createdAt: Order.DESC },
      ...fullMatches
    } = query;

    return this.model.paginate(
      {
        $and: [
          ...condition,
          fullMatches,
          formatSearchQuery(this.options.searchKeys as string[], search)
        ]
      } as any,
      {
        customLabels: { docs: 'data', totalDocs: 'total' },
        sort,
        page,
        limit: size,
        ...options
      }
    ) as any;
  }
}
