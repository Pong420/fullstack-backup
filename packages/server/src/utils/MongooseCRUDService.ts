import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  PaginateResult,
  Pagination,
  Search,
  Order,
  Timestamp
} from '@fullstack/typings';
import { formatSearchQuery, Condition } from './formatSearchQuery';

export { Condition };

type QuerySchema = {
  [K in keyof (Pagination & Search & Timestamp)]?: unknown;
};

const formatDateRange = (payload?: unknown) => {
  if (Array.isArray(payload)) {
    const [from, to] = payload;
    if (from && to) {
      return { $gte: from, $lte: to };
    }
  }
};

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
  @IsObject({ each: true })
  @Transform(formatDateRange)
  createdAt?: { $gte: string; $lte: string };

  @IsOptional()
  @IsString({ each: true })
  @Transform(formatDateRange)
  updatedAt?: { $gte: string; $lte: string };
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
    const createdCat = new this.model(createDto);
    return createdCat.save();
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
}
