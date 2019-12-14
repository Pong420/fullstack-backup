/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { PaginateOptions, QueryFindOneAndUpdateOptions } from 'mongoose';
import { UploadService, UploadFile, isUploadFile } from '../upload';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductModel } from './model';

@Injectable()
export class ProductsService {
  constructor(private readonly uploadService: UploadService) {}

  async handleNewImages(
    newImage: Array<UploadFile | string> = [],
    oldImages: string[] = []
  ) {
    oldImages.forEach(public_id => {
      if (!newImage.includes(public_id)) {
        !newImage.includes(public_id) &&
          this.uploadService.removeImage({ public_id });
      }
    });

    return Promise.all(
      newImage.map(item =>
        isUploadFile(item)
          ? this.uploadService
              .uploadImage(item)
              .then(result => result[0].public_id)
          : Promise.resolve(item)
      )
    );
  }

  removeImagesAfterExpection(images: string[]) {
    return images.map(public_id =>
      this.uploadService.removeImage({ public_id })
    );
  }

  async create({ images, ...createProductDto }: CreateProductDto) {
    const newImages = await this.handleNewImages(images);

    const createdProduct = new ProductModel({
      ...createProductDto,
      images: newImages
    });

    try {
      return await createdProduct.save();
    } catch (error) {
      this.removeImagesAfterExpection(newImages);

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
    product && this.removeImagesAfterExpection(product.images);
  }

  async update(
    { id, images, ...changes }: UpdateProductDto,
    options: QueryFindOneAndUpdateOptions = {}
  ) {
    const product = await ProductModel.findById(id);

    if (product) {
      const newImages = images
        ? await this.handleNewImages(images, product.images)
        : product.images;

      try {
        return ProductModel.findByIdAndUpdate(
          { _id: id },
          { ...changes, images: newImages },
          { ...options, new: true }
        );
      } catch (error) {
        this.removeImagesAfterExpection(newImages);

        return Promise.reject(error);
      }
    }

    throw new BadRequestException('Product not found');
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
