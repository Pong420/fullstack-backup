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
import { UploadFile } from '../upload/upload.interfaces';

export const UPLOAD_DIR = path.join(
  __dirname,
  process.env.NODE_ENV === 'development' ? '../../' : '../',
  '_upload'
);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const isArrayFormDataRegex = /\[\]$/;
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

      if (request.isMultipart) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {};

        await new Promise((resolve, reject) => {
          const mp = request.multipart(
            async (field, file, filename, encoding, mimetype) => {
              const fieldName = field.replace(isArrayFormDataRegex, '');
              const buffer = await crypto.pseudoRandomBytes(16);
              const hexFilename = buffer.toString('hex');
              const dest = path.join(dir, hexFilename);
              const result: UploadFile = {
                fieldname: fieldName,
                originalname: filename,
                encoding: encoding,
                mimetype: mimetype,
                filename: hexFilename,
                path: dest
              };

              // if there are multiple files uploaded return array else return single file
              if (body[fieldName]) {
                if (Array.isArray(body[fieldName])) {
                  body[fieldName].push(result);
                } else {
                  body[fieldName] = [body[fieldName], result];
                }
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

          mp.on('field', (key: string, value: unknown) => {
            if (isArrayFormData(key)) {
              const newKey = key.replace(isArrayFormDataRegex, '');
              body[newKey] = body[newKey] || [];
              body[newKey].push(value);
            } else {
              body[key] = value;
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
