import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { PaginateOptions, QueryFindOneAndUpdateOptions } from 'mongoose';
import {
  UploadService,
  UploadFile,
  isUploadFile,
  ResponsiveImage
} from '../upload';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductModel } from './model';

@Injectable()
export class ProductsService {
  constructor(private readonly uploadService: UploadService) {}

  handleImages(
    newImage: Array<UploadFile | ResponsiveImage> = [],
    oldImages: string[] = []
  ) {
    oldImages.forEach(this.uploadService.removeImage.bind(this.uploadService));
    return Promise.all(
      newImage.map(item =>
        isUploadFile(item)
          ? this.uploadService
              .uploadImage(item)
              .then(result =>
                this.uploadService.getResponsiveImage(result[0].public_id, {})
              )
          : Promise.resolve(item)
      )
    );
  }

  handleRemoveImage(images: ResponsiveImage[]) {
    return images.map(({ origin }) => this.uploadService.removeImage(origin));
  }

  async create({ images, ...createProductDto }: CreateProductDto) {
    const newImages = await this.handleImages(images, []);

    const createdProduct = new ProductModel({
      ...createProductDto,
      images: newImages
    });

    try {
      return await createdProduct.save();
    } catch (error) {
      this.handleRemoveImage(newImages);

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
        this.uploadService.removeImage(image.origin);
      });
    }
  }

  async update(
    { id, images, ...changes }: UpdateProductDto,
    options?: QueryFindOneAndUpdateOptions
  ) {
    const newImages = await this.handleImages(images, []);
    try {
      ProductModel.findOneAndUpdate(
        { _id: id },
        // TODO: remove old images
        { ...changes, images: newImages },
        {
          new: true,
          ...options
        }
      );
    } catch (error) {
      this.handleRemoveImage(newImages);
      return Promise.reject(error);
    }
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
