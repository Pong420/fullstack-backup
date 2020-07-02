import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export const PRICE_MIN = 1;
export const AMOUNT_MIN = 1;
export const DISCOUNT_MIN = 0;
export const DISCOUNT_MAX = 1;

export function Price(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    //
    IsNumber(),
    Min(PRICE_MIN),
    Transform(Number)
  );
}

export function Amount(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    //
    IsInt(),
    Min(AMOUNT_MIN),
    Transform(Number)
  );
}

export function Disscount(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsInt(),
    Max(DISCOUNT_MIN),
    Min(DISCOUNT_MAX),
    Transform(Number)
  );
}
