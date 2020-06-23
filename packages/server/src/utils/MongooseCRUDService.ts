import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { PaginateResult } from '@fullstack/typings';

export class MongooseCRUDService<T extends Document> {
  constructor(private model: PaginateModel<T>) {}

  async create<R = T>(createDto: unknown): Promise<T | R> {
    const createdCat = new this.model(createDto);
    return createdCat.save();
  }

  async delete(query: FilterQuery<T>): Promise<T> {
    return this.model.findOneAndDelete(query);
  }

  async update(
    query: FilterQuery<T>,
    changes: UpdateQuery<T>,
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

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
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
