import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { PaginateOptions, QueryFindOneAndUpdateOptions } from 'mongoose';
import { UploadService, UploadFile, isUploadFile } from '../upload';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductModel } from './model';

@Injectable()
export class ProductsService {
  constructor(private readonly uploadService: UploadService) {}

  handleImages(
    newImage: Array<UploadFile | string> = [],
    oldImages: string[] = []
  ) {
    oldImages.forEach(this.uploadService.removeImage.bind(this.uploadService));
    return Promise.all(
      newImage.map(item =>
        isUploadFile(item)
          ? this.uploadService
              .uploadImage(item)
              .then(result =>
                this.uploadService.getImageUrl(
                  `${result[0].public_id}.${result[0].format}`,
                  { secure: true }
                )
              )
          : Promise.resolve(item)
      )
    );
  }

  async create({ images, ...createProductDto }: CreateProductDto) {
    const createdProduct = new ProductModel({
      ...createProductDto,
      images: await this.handleImages(images, [])
    });

    try {
      return await createdProduct.save();
    } catch (error) {
      if (error instanceof MongoError) {
        switch (error.code) {
          case 11000:
            throw new BadRequestException('Product already exsits');
        }
      }
    }
  }

  async delete(id: string) {
    const product = await ProductModel.findOneAndDelete({ _id: id });
    if (product) {
      product.images.forEach(image => {
        this.uploadService.removeImage(image);
      });
    }
  }

  async update(
    { id, images, ...changes }: UpdateProductDto,
    options?: QueryFindOneAndUpdateOptions
  ) {
    return ProductModel.findOneAndUpdate(
      { _id: id },
      // TODO: remove images
      { ...changes, images: await this.handleImages(images, []) },
      {
        new: true,
        ...options
      }
    );
  }

  find(condition?: object, projection = '') {
    return ProductModel.find(condition, projection);
  }

  paginate(
    condition?: object,
    { page = 1, limit = 10, ...options }: PaginateOptions = {}
  ) {
    return ProductModel.paginate(condition, {
      page,
      limit,
      ...options
    });
  }
}
