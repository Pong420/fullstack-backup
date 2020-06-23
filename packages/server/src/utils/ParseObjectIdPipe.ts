import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  constructor(private errorMessage = 'Incorrect ObjectId format') {}
  transform(value: unknown): string {
    if (typeof value === 'string' && checkForHexRegExp.test(value)) {
      return value;
    }
    throw new BadRequestException(this.errorMessage);
  }
}
