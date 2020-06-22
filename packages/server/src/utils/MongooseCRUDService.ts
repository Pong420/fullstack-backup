import { Document, PaginateModel, PaginateOptions } from 'mongoose';
import { PaginateResult } from '@fullstack/typings';
import { FilterQuery } from 'mongoose';

export class MongooseCRUDService<T extends Document> {
  constructor(private model: PaginateModel<T>) {}

  async create(createDto: unknown): Promise<T> {
    const createdCat = new this.model(createDto);
    return createdCat.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  paginate(
    query?: FilterQuery<T>,
    { page = 1, limit = 10, ...options }: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    return this.model.paginate(query, {
      page,
      limit,
      customLabels: { docs: 'data', totalDocs: 'total' },
      ...options
    }) as any;
  }
}
