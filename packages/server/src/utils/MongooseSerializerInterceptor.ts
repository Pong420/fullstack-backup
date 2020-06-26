import { classToPlain } from 'class-transformer';
import { isObject } from 'class-validator';
import { Model } from 'mongoose';
import {
  Injectable,
  ClassSerializerInterceptor,
  PlainLiteralObject
} from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { PaginateResult } from '@fullstack/typings';

@Injectable()
export class MongooseSerializerInterceptor extends ClassSerializerInterceptor {
  serialize(
    response:
      | PlainLiteralObject
      | Array<PlainLiteralObject>
      | PaginateResult<unknown>,
    options: ClassTransformOptions
  ): PlainLiteralObject | PlainLiteralObject[] {
    const isArray = Array.isArray(response);
    if (!isObject(response) && !isArray) {
      return response;
    }

    if ('data' in response && 'total' in response) {
      return {
        ...response,
        data: response.data.map((item: PlainLiteralObject) =>
          this.transformToPlain(item, options)
        )
      };
    }

    return isArray
      ? (response as PlainLiteralObject[]).map(item =>
          this.transformToPlain(item, options)
        )
      : this.transformToPlain(response, options);
  }

  transformToPlain(
    plainOrClass: unknown,
    options: ClassTransformOptions
  ): PlainLiteralObject {
    if (plainOrClass instanceof Model) {
      plainOrClass = plainOrClass.toJSON();
    }
    return plainOrClass && plainOrClass.constructor !== Object
      ? classToPlain(plainOrClass, options)
      : plainOrClass;
  }
}
