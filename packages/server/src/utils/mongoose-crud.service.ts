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
  ValidateNested
} from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  PaginateResult,
  Pagination,
  Search,
  Order,
  Timestamp
} from '@fullstack/typings';
import { formatSearchQuery, Condition } from './format-search-query';
import { DateRannge } from '../decorators/range.decorator';

export { Condition };

type QuerySchema = {
  [K in keyof (Pagination & Search & Timestamp)]?: unknown;
};

interface MongoDateRange {
  $gte: string;
  $lte: string;
}

class Base implements QuerySchema {
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  size?: number;

  @IsOptional()
  sort?: Pagination['sort'];

  @Exclude()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  createdAt?: MongoDateRange;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  updatedAt?: MongoDateRange;
}

export class QueryDto extends Base
  implements Required<Omit<QuerySchema, keyof Base>> {}

interface Options<T> {
  searchKeys?: (keyof T)[];
}

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(
    private model: PaginateModel<D>,
    private readonly options: Options<T> = {}
  ) {}

  async create(createDto: unknown): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async delete(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<unknown>,
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

  async clear(): Promise<void> {
    await this.model.deleteMany({});
  }
}
