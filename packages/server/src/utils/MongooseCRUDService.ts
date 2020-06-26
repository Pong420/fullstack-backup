import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { PaginateResult } from '@fullstack/typings';

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(private model: PaginateModel<D>) {}

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
    query?: Record<string, unknown>,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    return this.model.paginate(query as any, {
      customLabels: { docs: 'data', totalDocs: 'total' },
      ...options
    }) as any;
  }
}
