import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { FastifyReply } from 'fastify';
import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

function handleMongooseError(
  error: unknown
): [keyof typeof HttpStatus, string] | undefined {
  if (error instanceof MongooseError.CastError) {
    if (error.path === '_id') {
      return ['BAD_REQUEST', 'Incorrect id'];
    }
    return [
      'BAD_REQUEST',
      `Cast to '${error.kind}' failed for value '${error.value}' at path '${error.path}'`
    ];
  }

  if (error instanceof MongoError) {
    switch (error.code) {
      case 11000:
        return [
          'BAD_REQUEST',
          `${Object.keys((error as any).keyValue).join(',')} already exists`
        ];
    }
  }
}

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const [type, message] = handleMongooseError(exception) || [];

    if (typeof type !== 'undefined') {
      const status = HttpStatus[type];
      response.status(status).send({
        statusCode: status,
        message
      });
    } else {
      super.catch(exception, host);
    }
  }
}