import fs from 'fs';
import pump from 'pump';
import path from 'path';
import crypto from 'crypto';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
  mixin
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class Uploaded {
  fieldname: string;

  originalname: string;

  encoding: string;

  @IsString()
  mimetype: string;

  filename: string;

  @IsString()
  path: string;

  constructor(payload: Partial<Uploaded>) {
    Object.assign(this, payload);
  }
}

export const UPLOAD_DIR = path.join(__dirname, '../../../../', '_upload');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const isArrayFormDataRegex = /\[.*\]/;
const isArrayFormData = (key: string) => isArrayFormDataRegex.test(key);

export function MultiPartInterceptor(
  dir: string = UPLOAD_DIR
): Type<NestInterceptor> {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  class MixinInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler
    ): Promise<Observable<unknown>> {
      const http = context.switchToHttp();
      const request: FastifyRequest = http.getRequest();

      if (request.isMultipart()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {};

        await new Promise((resolve, reject) => {
          const mp = request.multipart(
            async (field, file, filename, encoding, mimetype) => {
              const fieldName = field.replace(isArrayFormDataRegex, '');
              const buffer = crypto.pseudoRandomBytes(16);
              const hexFilename = buffer.toString('hex');
              const dest = path.join(dir, hexFilename);
              const result = plainToClass(Uploaded, {
                fieldname: fieldName,
                originalname: filename,
                encoding: encoding,
                mimetype: mimetype,
                filename: hexFilename,
                path: dest
              });

              if (isArrayFormData(field)) {
                body[fieldName] = body[fieldName] || [];
                body[fieldName].push(result);
              } else {
                body[fieldName] = result;
              }

              pump(file, fs.createWriteStream(dest));
            },
            error => {
              if (error) {
                return reject(error);
              }
            }
          );

          mp.on('field', (field: string, value: unknown) => {
            if (value === 'null') {
              value = null;
            }

            if (isArrayFormData(field)) {
              const fieldName: string = field.replace(isArrayFormDataRegex, '');
              const matches = field.match(/(?<=\[).*?(?=\])/g) || [];

              body[fieldName] = body[fieldName] || [];

              matches.reduce((acc, idx, index) => {
                if (matches.length === index + 1) {
                  acc[idx] = value;
                } else {
                  acc[idx] =
                    typeof acc[idx] === 'undefined'
                      ? isNaN(Number(next))
                        ? {}
                        : []
                      : acc[idx];
                }
                return acc[idx];
              }, body[fieldName]);
            } else {
              body[field] = value;
            }
          });

          mp.on('finish', () => {
            request.body = body;
            resolve();
          });
        });
      }

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
